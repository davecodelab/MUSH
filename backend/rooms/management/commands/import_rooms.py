import os
from openpyxl import load_workbook
from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand
from django.db import transaction
from rooms.models import Room, RoomSpace


def default_room_price(capacity, has_ac):
    if capacity == 1:
        return 16500.00 if has_ac else 14000.00
    if capacity == 2:
        return 7500.00 if has_ac else 7000.00
    if capacity == 3:
        return 9500.00 if has_ac else 8200.00
    return 7800.00 if has_ac else 6500.00


class Command(BaseCommand):
    help = 'Import rooms from MUSHIA.xlsx and ensure admin superuser exists'

    def add_arguments(self, parser):
        parser.add_argument('excel_path', type=str, help='Path to MUSHIA.xlsx')

    @transaction.atomic
    def handle(self, *args, **kwargs):
        wb = load_workbook(kwargs['excel_path'], data_only=True)
        rows = list(wb.active.iter_rows(values_only=True))
        if len(rows) < 3:
            return

        headers = rows[0]
        floor_col_indices = [1, 4, 7, 10, 13, 16]
        existing_room_nums = set(Room.objects.values_list('room_number', flat=True))
        rooms_to_create = []
        seen = set()

        for col in floor_col_indices:
            if col >= len(headers) or not headers[col]:
                continue
            floor_name = str(headers[col]).strip()

            for row in rows[2:]:
                if col + 1 >= len(row):
                    continue
                room_num, room_type = row[col], row[col + 1]
                if room_num is None or room_type is None:
                    continue

                room_num_str = str(room_num).strip()
                room_type_str = str(room_type).strip()
                if not room_num_str or room_num_str in existing_room_nums or room_num_str in seen:
                    continue
                seen.add(room_num_str)

                upper_type = room_type_str.upper()
                has_ac = 'AC' in upper_type
                amenities = []
                if has_ac:
                    amenities.append('AC')
                if 'SMALL' in upper_type:
                    amenities.append('Small')
                else:
                    amenities.append('Standard')

                if 'RESERVED' in upper_type:
                    amenities.append('Reserved')
                    capacity = 1
                else:
                    capacity = int(room_type_str[0]) if room_type_str[0].isdigit() else 1

                rooms_to_create.append(
                    Room(
                        room_number=room_num_str,
                        floor=floor_name,
                        room_type=room_type_str,
                        capacity=capacity,
                        price_per_space=default_room_price(capacity, has_ac),
                        amenities=amenities,
                    )
                )

        rooms_created = 0
        spaces_created = 0
        if rooms_to_create:
            created_rooms = Room.objects.bulk_create(rooms_to_create)
            letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
            spaces_to_create = [
                RoomSpace(room=room, space_identifier=letters[j])
                for room in created_rooms
                for j in range(room.capacity)
            ]
            RoomSpace.objects.bulk_create(spaces_to_create)
            rooms_created = len(created_rooms)
            spaces_created = len(spaces_to_create)

        # Backfill default prices and normalize size amenities for existing rooms
        all_existing = list(Room.objects.all())
        rooms_to_update = []
        for r in all_existing:
            upper_t = (r.room_type or '').upper()
            has_ac = 'AC' in upper_t or 'AC' in (r.amenities or [])
            expected_amenities = []
            if has_ac:
                expected_amenities.append('AC')
            if 'SMALL' in upper_t:
                expected_amenities.append('Small')
            else:
                expected_amenities.append('Standard')
            if 'RESERVED' in upper_t:
                expected_amenities.append('Reserved')

            needs_save = False
            if r.price_per_space == 0:
                r.price_per_space = default_room_price(r.capacity, has_ac)
                needs_save = True
            if r.amenities != expected_amenities:
                r.amenities = expected_amenities
                needs_save = True
            if needs_save:
                rooms_to_update.append(r)

        if rooms_to_update:
            Room.objects.bulk_update(rooms_to_update, ['price_per_space', 'amenities'])

        self.stdout.write(self.style.SUCCESS(f"Successfully created {rooms_created} rooms and {spaces_created} spaces!"))

        User = get_user_model()
        admin_username = os.environ.get('DJANGO_SUPERUSER_USERNAME', 'admin')
        admin_email = os.environ.get('DJANGO_SUPERUSER_EMAIL', 'admin@mushiahostel.com')
        admin_password = os.environ.get('DJANGO_SUPERUSER_PASSWORD', 'MushiaAdmin2026!')
        if not User.objects.filter(username=admin_username).exists():
            User.objects.create_superuser(
                username=admin_username,
                email=admin_email,
                password=admin_password,
                first_name='Mushia',
                last_name='Admin',
            )
            self.stdout.write(self.style.SUCCESS(f"Created admin superuser '{admin_username}'."))
