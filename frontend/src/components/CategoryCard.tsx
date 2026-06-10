import React from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';

interface CategoryCardProps {
  id: string;
  label: string;
  image: string;
  count: number;
  onClick: (id: string) => void;
}

export default function CategoryCard({ id, label, image, count, onClick }: CategoryCardProps) {
  return (
    <motion.button
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
      onClick={() => onClick(id)}
      className="group relative w-full aspect-square bg-white rounded-[32px] overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl hover:shadow-blue-200/50 transition-all duration-500 text-left cursor-pointer"
    >
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src={image} 
          alt={label} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A192F] via-[#0A192F]/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
      </div>

      {/* Content */}
      <div className="absolute inset-0 p-6 flex flex-col justify-end">
        <div className="flex items-center justify-between">
          <div>
            <span className="block text-white font-serif text-lg font-black tracking-tight leading-tight mb-1 drop-shadow-md group-hover:text-cyan-300 transition-colors">
              {label}
            </span>
            <span className="flex items-center space-x-1">
              <span className="w-1.5 h-1.5 bg-blue-400 rounded-full animate-pulse" />
              <span className="text-blue-300 text-[10px] font-black uppercase tracking-widest drop-shadow-sm">
                {count} {count === 1 ? 'Variety' : 'Varieties'}
              </span>
            </span>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center -mr-2 group-hover:bg-[#0077B6] group-hover:border-[#0077B6] transition-all transform group-hover:translate-x-1">
            <ArrowRight className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* Hover State Detail */}
      <div className="absolute top-4 right-4 translate-x-12 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-500">
        <div className="bg-cyan-400 text-[#0A192F] text-[9px] font-black px-2.5 py-1 rounded-lg shadow-lg uppercase tracking-wider">
          View All
        </div>
      </div>
    </motion.button>
  );
}
