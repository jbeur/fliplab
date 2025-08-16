/**
 * Generic item images for confirmation
 * These are placeholder images that represent common item categories
 */
export const ITEM_IMAGES: Record<string, string> = {
  // Sports Equipment
  'golf club': 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=300&fit=crop',
  'golf': 'https://images.unsplash.com/photo-1535131749006-b7f58c99034b?w=400&h=300&fit=crop',
  'tennis racket': 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=300&fit=crop',
  'basketball': 'https://images.unsplash.com/photo-1546519638-68e109498ffc?w=400&h=300&fit=crop',
  'soccer ball': 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=400&h=300&fit=crop',
  
  // Electronics
  'phone': 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=300&fit=crop',
  'laptop': 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=300&fit=crop',
  'camera': 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400&h=300&fit=crop',
  'headphones': 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=300&fit=crop',
  
  // Clothing & Fashion
  'shoes': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
  'sneakers': 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=300&fit=crop',
  'handbag': 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop',
  'watch': 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400&h=300&fit=crop',
  
  // Kitchen & Home
  'mixer': 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400&h=300&fit=crop',
  'blender': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
  'coffee maker': 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=400&h=300&fit=crop',
  'toaster': 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop',
  
  // Books & Media
  'book': 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
  'vinyl': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
  'cd': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
  
  // Tools & Hardware
  'drill': 'https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=300&fit=crop',
  'hammer': 'https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=300&fit=crop',
  'saw': 'https://images.unsplash.com/photo-1581147036324-c1c89c2c8b5c?w=400&h=300&fit=crop',
  
  // Default fallback
  'default': 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop'
};

/**
 * Find the best matching generic image for an item
 * @param itemName - Name of the item to find image for
 * @returns string - URL of the generic image
 */
export const getGenericItemImage = (itemName: string): string => {
  const lowerName = itemName.toLowerCase();
  
  // Try to find exact matches first
  for (const [key, image] of Object.entries(ITEM_IMAGES)) {
    if (lowerName.includes(key) || key.includes(lowerName)) {
      return image;
    }
  }
  
  // Try partial matches
  for (const [key, image] of Object.entries(ITEM_IMAGES)) {
    if (lowerName.includes(key.split(' ')[0]) || key.split(' ').some(word => lowerName.includes(word))) {
      return image;
    }
  }
  
  // Return default if no match found
  return ITEM_IMAGES.default;
};

/**
 * Get a random generic image for demo purposes
 * @returns string - URL of a random generic image
 */
export const getRandomGenericImage = (): string => {
  const images = Object.values(ITEM_IMAGES);
  return images[Math.floor(Math.random() * (images.length - 1))]; // Exclude default
};
