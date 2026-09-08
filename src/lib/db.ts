import { Service, Booking, BlogPost, AdminUser } from './types';
import { INITIAL_SERVICES, INITIAL_POSTS, INITIAL_BOOKINGS } from './seed-data';

// Singleton in-memory/fallback store for Next.js local dev & preview
interface LocalStore {
  services: Service[];
  posts: BlogPost[];
  bookings: Booking[];
  admins: AdminUser[];
}

declare global {
  var __ngancare_store__: LocalStore | undefined;
}

function getLocalStore(): LocalStore {
  if (!globalThis.__ngancare_store__) {
    globalThis.__ngancare_store__ = {
      services: [...INITIAL_SERVICES],
      posts: [...INITIAL_POSTS],
      bookings: [...INITIAL_BOOKINGS],
      admins: [
        {
          id: 'adm-01',
          username: 'admin',
          role: 'admin',
          created_at: new Date().toISOString(),
        },
      ],
    };
  }
  return globalThis.__ngancare_store__;
}

export const localDb = {
  // Services
  getServices: async (): Promise<Service[]> => {
    return getLocalStore().services.filter((s) => s.is_active === 1);
  },
  getAllServicesAdmin: async (): Promise<Service[]> => {
    return getLocalStore().services;
  },
  getServiceById: async (id: string): Promise<Service | undefined> => {
    return getLocalStore().services.find((s) => s.id === id);
  },
  createService: async (service: Service): Promise<Service> => {
    getLocalStore().services.unshift(service);
    return service;
  },
  updateService: async (id: string, updates: Partial<Service>): Promise<Service | null> => {
    const store = getLocalStore();
    const idx = store.services.findIndex((s) => s.id === id);
    if (idx === -1) return null;
    store.services[idx] = { ...store.services[idx], ...updates };
    return store.services[idx];
  },
  deleteService: async (id: string): Promise<boolean> => {
    const store = getLocalStore();
    const idx = store.services.findIndex((s) => s.id === id);
    if (idx === -1) return false;
    store.services.splice(idx, 1);
    return true;
  },

  // Posts
  getPublishedPosts: async (): Promise<BlogPost[]> => {
    return getLocalStore().posts.filter((p) => p.is_published === 1);
  },
  getAllPostsAdmin: async (): Promise<BlogPost[]> => {
    return getLocalStore().posts;
  },
  getPostBySlug: async (slug: string): Promise<BlogPost | undefined> => {
    const post = getLocalStore().posts.find((p) => p.slug === slug);
    if (post) {
      post.views = (post.views || 0) + 1;
    }
    return post;
  },
  createPost: async (post: BlogPost): Promise<BlogPost> => {
    getLocalStore().posts.unshift(post);
    return post;
  },
  updatePost: async (id: string, updates: Partial<BlogPost>): Promise<BlogPost | null> => {
    const store = getLocalStore();
    const idx = store.posts.findIndex((p) => p.id === id);
    if (idx === -1) return null;
    store.posts[idx] = {
      ...store.posts[idx],
      ...updates,
      updated_at: new Date().toISOString(),
    };
    return store.posts[idx];
  },
  deletePost: async (id: string): Promise<boolean> => {
    const store = getLocalStore();
    const idx = store.posts.findIndex((p) => p.id === id);
    if (idx === -1) return false;
    store.posts.splice(idx, 1);
    return true;
  },

  // Bookings
  getBookings: async (): Promise<Booking[]> => {
    return getLocalStore().bookings;
  },
  createBooking: async (booking: Booking): Promise<Booking> => {
    const store = getLocalStore();
    const service = store.services.find((s) => s.id === booking.service_id);
    const enrichedBooking: Booking = {
      ...booking,
      service_name: service ? service.name : booking.service_name || 'Dịch vụ tư vấn chung',
      created_at: new Date().toISOString(),
    };
    store.bookings.unshift(enrichedBooking);
    return enrichedBooking;
  },
  updateBookingStatus: async (
    id: string,
    status: Booking['status']
  ): Promise<Booking | null> => {
    const store = getLocalStore();
    const booking = store.bookings.find((b) => b.id === id);
    if (!booking) return null;
    booking.status = status;
    return booking;
  },

  // Admin Auth
  verifyAdmin: async (username: string, password: string): Promise<boolean> => {
    // Default credentials for dev & initial setup: admin / ngancare2026! or admin
    return (
      username === 'admin' &&
      (password === 'ngancare2026!' || password === 'admin' || password === '123456')
    );
  },
};
