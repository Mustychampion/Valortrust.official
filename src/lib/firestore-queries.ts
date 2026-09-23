/**
 * Firestore Queries & Service Layer
 * Migrated from supabase-setup.sql
 *
 * Uses Firebase Modular Web SDK (v9/v10) with type-safe operations.
 */
import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  serverTimestamp,
  increment,
  arrayUnion,
  DocumentData,
  QueryConstraint,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from './firebase';
import type {
  Enquiry,
  Subscriber,
  BlogPost,
  PortfolioItem,
  Testimonial,
  VisitorLog,
} from '../types/firestore.types';

// ============================================================================
// 1. ENQUIRIES
// ============================================================================

export const enquiriesCollection = collection(db, 'enquiries');

/** Insert new enquiry (Public) */
export async function createEnquiry(data: Omit<Enquiry, 'id' | 'created_at' | 'status'> & { status?: 'unread' | 'read' }) {
  return await addDoc(enquiriesCollection, {
    ...data,
    status: data.status || 'unread',
    created_at: new Date().toISOString(),
  });
}

/** Get all enquiries (Admin) */
export async function getEnquiries(statusFilter?: 'unread' | 'read') {
  const constraints: QueryConstraint[] = [orderBy('created_at', 'desc')];
  if (statusFilter) {
    constraints.unshift(where('status', '==', statusFilter));
  }
  const q = query(enquiriesCollection, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Enquiry));
}

/** Mark enquiry as read/unread (Admin) */
export async function updateEnquiryStatus(id: string, status: 'unread' | 'read') {
  const docRef = doc(db, 'enquiries', id);
  return await updateDoc(docRef, { status });
}

/** Delete enquiry (Admin) */
export async function deleteEnquiry(id: string) {
  return await deleteDoc(doc(db, 'enquiries', id));
}

// ============================================================================
// 2. SUBSCRIBERS
// ============================================================================

export const subscribersCollection = collection(db, 'subscribers');

/**
 * Add newsletter subscriber (Public)
 * Uses lowercase email as Document ID to enforce unique email constraint
 */
export async function addSubscriber(email: string) {
  const normalizedEmail = email.trim().toLowerCase();
  const docRef = doc(db, 'subscribers', normalizedEmail);
  
  // setDoc with merge: false ensures uniqueness or updates timestamp safely
  return await setDoc(docRef, {
    email: normalizedEmail,
    created_at: new Date().toISOString(),
  }, { merge: true });
}

/** Get all newsletter subscribers (Admin) */
export async function getSubscribers() {
  const q = query(subscribersCollection, orderBy('created_at', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Subscriber));
}

/** Delete / Unsubscribe subscriber (Admin) */
export async function removeSubscriber(emailOrId: string) {
  return await deleteDoc(doc(db, 'subscribers', emailOrId.toLowerCase()));
}

// ============================================================================
// 3. BLOG POSTS
// ============================================================================

export const blogPostsCollection = collection(db, 'blog_posts');

/** Get published blog posts (Public) */
export async function getPublishedBlogPosts() {
  const q = query(
    blogPostsCollection,
    where('status', '==', 'published'),
    orderBy('created_at', 'desc')
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
}

/** Get single blog post by slug (Public) */
export async function getBlogPostBySlug(slug: string) {
  const q = query(blogPostsCollection, where('slug', '==', slug), limit(1));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  return { id: docSnap.id, ...docSnap.data() } as BlogPost;
}

/** Get all blog posts including drafts (Admin) */
export async function getAllBlogPosts() {
  const q = query(blogPostsCollection, orderBy('created_at', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as BlogPost));
}

/** Create blog post (Admin) */
export async function createBlogPost(data: Omit<BlogPost, 'id' | 'created_at'>) {
  return await addDoc(blogPostsCollection, {
    ...data,
    created_at: new Date().toISOString(),
    published_at: data.status === 'published' ? new Date().toISOString() : data.published_at || null,
  });
}

/** Update blog post (Admin) */
export async function updateBlogPost(id: string, data: Partial<BlogPost>) {
  const docRef = doc(db, 'blog_posts', id);
  return await updateDoc(docRef, data as DocumentData);
}

/** Delete blog post (Admin) */
export async function deleteBlogPost(id: string) {
  return await deleteDoc(doc(db, 'blog_posts', id));
}

// ============================================================================
// 4. PORTFOLIO
// ============================================================================

export const portfolioCollection = collection(db, 'portfolio');

/** Get all portfolio items (Public) */
export async function getPortfolioItems(category?: string) {
  const constraints: QueryConstraint[] = [orderBy('created_at', 'desc')];
  if (category && category !== 'all') {
    constraints.unshift(where('category', '==', category));
  }
  const q = query(portfolioCollection, ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as PortfolioItem));
}

/** Create portfolio item (Admin) */
export async function createPortfolioItem(data: Omit<PortfolioItem, 'id' | 'created_at'>) {
  return await addDoc(portfolioCollection, {
    ...data,
    created_at: new Date().toISOString(),
  });
}

/** Update portfolio item (Admin) */
export async function updatePortfolioItem(id: string, data: Partial<PortfolioItem>) {
  const docRef = doc(db, 'portfolio', id);
  return await updateDoc(docRef, data as DocumentData);
}

/** Delete portfolio item (Admin) */
export async function deletePortfolioItem(id: string) {
  return await deleteDoc(doc(db, 'portfolio', id));
}

// ============================================================================
// 5. TESTIMONIALS
// ============================================================================

export const testimonialsCollection = collection(db, 'testimonials');

/** Get all testimonials (Public) */
export async function getTestimonials() {
  const q = query(testimonialsCollection, orderBy('created_at', 'desc'));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as Testimonial));
}

/** Create testimonial (Admin) */
export async function createTestimonial(data: Omit<Testimonial, 'id' | 'created_at'>) {
  return await addDoc(testimonialsCollection, {
    ...data,
    created_at: new Date().toISOString(),
  });
}

/** Update testimonial (Admin) */
export async function updateTestimonial(id: string, data: Partial<Testimonial>) {
  const docRef = doc(db, 'testimonials', id);
  return await updateDoc(docRef, data as DocumentData);
}

/** Delete testimonial (Admin) */
export async function deleteTestimonial(id: string) {
  return await deleteDoc(doc(db, 'testimonials', id));
}

// ============================================================================
// 6. VISITOR LOGS
// ============================================================================

export const visitorLogsCollection = collection(db, 'visitor_logs');

/**
 * Record or Upsert Visitor Log (Public)
 * Uses sanitized IP or doc for tracking
 */
export async function logVisitor(info: {
  ip_address: string;
  country?: string | null;
  city?: string | null;
  region?: string | null;
  isp?: string | null;
  asn?: string | null;
  device_type?: string | null;
  path: string;
  is_returning?: boolean;
}) {
  return await addDoc(visitorLogsCollection, {
    ...info,
    visit_count: 1,
    last_seen: new Date().toISOString(),
    created_at: new Date().toISOString(),
    is_returning: info.is_returning ?? false,
    path_history: [info.path],
  });
}

/** Get visitor logs (Admin) */
export async function getVisitorLogs(limitCount = 100) {
  const q = query(visitorLogsCollection, orderBy('last_seen', 'desc'), limit(limitCount));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() } as VisitorLog));
}

// ============================================================================
// 7. STORAGE HELPERS (Blog images, Portfolio images, Testimonials)
// ============================================================================

export async function uploadMediaFile(
  folder: 'blog-images' | 'portfolio-images' | 'testimonial-photos',
  file: File,
  customName?: string
): Promise<string> {
  const ext = file.name.split('.').pop();
  const fileName = customName ? `${customName}.${ext}` : `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${ext}`;
  const storageRef = ref(storage, `${folder}/${fileName}`);
  
  await uploadBytes(storageRef, file);
  return await getDownloadURL(storageRef);
}

export async function deleteMediaFileByUrl(url: string): Promise<void> {
  const storageRef = ref(storage, url);
  return await deleteObject(storageRef);
}
