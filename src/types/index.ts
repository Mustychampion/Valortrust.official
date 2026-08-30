import { Database } from './database.types';

export type ContactFormData = {
  name: string;
  email: string;
  phone: string;
  sector: string;
  message: string;
};

export type NewsletterSubscriber = Database['public']['Tables']['subscribers']['Row'];
export type BlogPost = Database['public']['Tables']['blog_posts']['Row'];
export type PortfolioItem = Database['public']['Tables']['portfolio']['Row'];
export type Testimonial = Database['public']['Tables']['testimonials']['Row'];
export type EnquiryRecord = Database['public']['Tables']['enquiries']['Row'];
export type VisitorLog = Database['public']['Tables']['visitor_logs']['Row'];

export type AdminBlogForm = Omit<Database['public']['Tables']['blog_posts']['Insert'], 'id' | 'created_at'>;
export type AdminPortfolioForm = Omit<Database['public']['Tables']['portfolio']['Insert'], 'id' | 'created_at'>;
export type AdminTestimonialForm = Omit<Database['public']['Tables']['testimonials']['Insert'], 'id' | 'created_at'>;
