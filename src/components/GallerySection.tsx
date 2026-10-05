import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MUSHIA_IMAGES } from '../data/seedRooms';
import { X, ZoomIn } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const galleryItems = [
    {
      id: 1,
      title: 'Mushia Hostel Facade & Entrance',
      category: 'exterior',
      categoryLabel: 'Hostel Exterior',
      src: MUSHIA_IMAGES.exterior,
      description: 'Architectural exterior showing stone textures and warm mauve panels at Ayeduase Newsite.',
    },
    {
      id: 2,
      title: 'Spacious 2-in-1 AC Bedroom Suite',
      category: 'rooms',
      categoryLabel: 'Bedrooms',
      src: MUSHIA_IMAGES.interior,
      description: 'Fitted wooden study desks, individual wardrobes, clean beds, and split-unit air conditioning.',
    },
    {
      id: 3,
      title: 'Dedicated 24-Hour Study Hall',
      category: 'study',
      categoryLabel: 'Study Hall',
      src: MUSHIA_IMAGES.studyRoom,
      description: 'Quiet academic sanctuary equipped with high-speed internet and ergonomic workstations.',
    },
    {
      id: 4,
      title: 'TV Entertainment Lounge',
      category: 'common',
      categoryLabel: 'Common Lounge',
      src: MUSHIA_IMAGES.lounge,
      description: 'Sectional seating and satellite flat screen TV for resident downtime and match screenings.',
    },
    {
      id: 5,
      title: 'Balcony Corridor & Sunset View',
      category: 'exterior',
      categoryLabel: 'Hostel Exterior',
      src: MUSHIA_IMAGES.exterior,
      description: 'Upper floor open-air balcony corridors with natural breeze across Ayeduase.',
    },
    {
      id: 6,
      title: 'Single Executive 1-in-1 Room',
      category: 'rooms',
      categoryLabel: 'Bedrooms',
      src: MUSHIA_IMAGES.interior,
      description: 'Private single occupancy room with dedicated study workstation and private en-suite washroom.',
    },
  ];

  const categories = [
    { id: 'all', label: 'All Photos' },
    { id: 'exterior', label: 'Hostel Exterior' },
    { id: 'rooms', label: 'Bedrooms' },
    { id: 'study', label: 'Study Hall' },
    { id: 'common', label: 'TV Lounge' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? galleryItems
    : galleryItems.filter((item) => item.category === selectedCategory);

  return (
    <section id="gallery" className="py-20 bg-[#EAE3D9]/60 border-t border-b border-[#A1927D]/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold tracking-widest text-[#7D6E66] uppercase mb-2 block">
            Visual Tour
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#2A2827] tracking-tight">
            Mushia Hostel Photo Gallery
          </h2>
          <p className="mt-2 text-sm text-[#5B514B]">
            Authentic photographs of the building, study spaces, bedrooms, and resident amenities.
          </p>

          {/* Filter Segmented Control */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-6">
            {categories.map((cat) => (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  selectedCategory === cat.id
                    ? 'bg-[#2A2827] text-[#FEFB58] shadow-sm'
                    : 'bg-white text-[#5B514B] hover:bg-[#F4EFE7] hover:text-[#2A2827] border border-[#A1927D]/40'
                }`}
              >
                {cat.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Gallery Grid with layout animations */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredItems.map((item) => (
              <motion.div
                layout
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                whileHover={{ y: -5 }}
                onClick={() => setLightboxImg(item.src)}
                className="group relative rounded-xl overflow-hidden bg-[#2A2827] aspect-[4/3] cursor-pointer border border-[#A1927D]/40 shadow-sm hover:shadow-2xl transition-all"
              >
                <img
                  src={item.src}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2A2827] via-[#2A2827]/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-[10px] uppercase font-bold text-[#FEFB58] tracking-wider block mb-1">
                    {item.categoryLabel}
                  </span>
                  <h4 className="font-bold text-sm text-[#F4EFE7] leading-snug">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#A5ABAA] mt-1 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="absolute top-3 right-3 p-2 rounded-lg bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                  <ZoomIn className="w-4 h-4" />
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Lightbox Modal with smooth scale & blur */}
        <AnimatePresence>
          {lightboxImg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setLightboxImg(null)}
              className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer"
            >
              <button
                onClick={() => setLightboxImg(null)}
                className="absolute top-6 right-6 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
              <motion.img
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                src={lightboxImg}
                alt="Fullscreen preview"
                className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl"
                referrerPolicy="no-referrer"
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </section>
  );
};
