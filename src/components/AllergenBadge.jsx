import React from 'react';
import { Flame, Leaf, Wheat, Milk, Nut, Fish, Egg } from 'lucide-react';

const ALLERGEN_META = {
  gluten: { labels: { es: 'Gluten', en: 'Gluten', fr: 'Gluten' }, color: 'bg-amber-950/60 text-amber-300 border-amber-800/60', icon: Wheat },
  dairy: { labels: { es: 'Lácteos', en: 'Dairy', fr: 'Produits laitiers' }, color: 'bg-blue-950/60 text-blue-300 border-blue-800/60', icon: Milk },
  shellfish: { labels: { es: 'Mariscos', en: 'Shellfish', fr: 'Crustacés' }, color: 'bg-cyan-950/60 text-cyan-300 border-cyan-800/60', icon: Fish },
  nuts: { labels: { es: 'Nueces', en: 'Nuts', fr: 'Fruits à coque' }, color: 'bg-orange-950/60 text-orange-300 border-orange-800/60', icon: Nut },
  eggs: { labels: { es: 'Huevo', en: 'Eggs', fr: 'Œufs' }, color: 'bg-yellow-950/60 text-yellow-300 border-yellow-800/60', icon: Egg },
  spicy: { labels: { es: 'Picante', en: 'Spicy', fr: 'Épicé' }, color: 'bg-rose-950/60 text-rose-300 border-rose-800/60', icon: Flame },
  vegan: { labels: { es: 'Vegano', en: 'Vegan', fr: 'Végétalien' }, color: 'bg-emerald-950/60 text-emerald-300 border-emerald-800/60', icon: Leaf },
  vegetarian: { labels: { es: 'Vegetariano', en: 'Vegetarian', fr: 'Végétarien' }, color: 'bg-green-950/60 text-green-300 border-green-800/60', icon: Leaf },
  fish: { labels: { es: 'Pescado', en: 'Fish', fr: 'Poisson' }, color: 'bg-teal-950/60 text-teal-300 border-teal-800/60', icon: Fish },
};

export default function AllergenBadge({ type, size = 'sm', lang = 'es' }) {
  const meta = ALLERGEN_META[type];
  if (!meta) return null;

  const Icon = meta.icon;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5 gap-1 font-semibold' : 'text-xs px-2.5 py-1 gap-1.5 font-bold';
  const label = meta.labels?.[lang] || meta.labels?.es || meta.label || type;

  return (
    <span
      className={`inline-flex items-center rounded-full border shadow-sm ${meta.color} ${sizeClasses}`}
      title={label}
    >
      <Icon className={size === 'sm' ? 'w-3 h-3' : 'w-3.5 h-3.5'} aria-hidden="true" />
      <span>{label}</span>
    </span>
  );
}
