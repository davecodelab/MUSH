import pandas as pd
from django.core.management.base import BaseCommand
from rooms.models import Room, RoomSpace
from django.db import transaction

class Command(BaseCommand):
    help = 'Import rooms from MUSHIA.xlsx'

    def add_arguments(self, parser):
        parser.add_argument('excel_path', type=str, help='Path to MUSHIA.xlsx')

    @transaction.atomic
    def handle(self, *args, **kwargs):
        excel_path = kwargs['excel_path']
        self.stdout.write(f"Reading {excel_path}...")

        try:
            df = pd.read_excel(excel_path)
        except Exception as e:
            self.stderr.write(f"Error reading file: {e}")
            return

        # The specific indices of the floor headers in the Excel file
        floor_col_indices = [1, 4, 7, 10, 13, 16]
        
        rooms_created = 0
        spaces_created = 0

        for i in floor_col_indices:
            if i >= len(df.columns): continue
            
            floor_name = df.columns[i]
            
            for idx, row in df.iterrows():
                if idx == 0: continue # Skip the "ROOM #" "ROOM TYPE" row
                
                room_num = row.iloc[i]
                room_type = row.iloc[i+1] if (i+1) < len(row) else None
                
                if pd.notna(room_num) and pd.notna(room_type):
                    room_num_str = str(room_num).strip()
                    room_type_str = str(room_type).strip()
                    
                    # Parse capacity from room_type (e.g., '4IN1' -> 4)
                    try:
                        capacity = int(room_type_str[0])
                    except ValueError:
                        self.stderr.write(f"Could not parse capacity for {room_num_str} from {room_type_str}")
                        continue
                        
                    # Create or get Room
                    room, created = Room.objects.get_or_create(
                        room_number=room_num_str,
                        defaults={
                            'floor': floor_name,
                            'room_type': room_type_str,
                            'capacity': capacity,
                            'price_per_space': 0.00, # Default, can be updated later
                        }
                    )
                    
                    if created:
                        rooms_created += 1
                        # Create RoomSpaces (e.g., A, B, C, D)
                        letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"
                        for j in range(capacity):
                            space_id = letters[j]
                            RoomSpace.objects.create(
                                room=room,
                                space_identifier=space_id
                            )
                            spaces_created += 1

        self.stdout.write(self.style.SUCCESS(f"Successfully created {rooms_created} rooms and {spaces_created} spaces!"))
