// Import mock data
import { sitters } from './sitters';
import { parents } from './parents';
import { children } from './children';
import { bookings } from './bookings';
import { reviews } from './reviews';
import { messages } from './messages';
import { notifications } from './notifications';
import { adventures } from './adventures';
import { earnings } from './earnings';
import { jobOpportunities } from './jobs';
import { currentSitter } from './current-sitter';
import { sitterBookings, getBookingsByStatus, getBookingStats } from './sitter-bookings';

// Re-export mock data
export { sitters, parents, children, bookings, reviews, messages, notifications, adventures, earnings, jobOpportunities, currentSitter, sitterBookings, getBookingsByStatus, getBookingStats };

// Helper functions
export const getSitterById = (id) => {
  return sitters.find(sitter => sitter.id === id);
};

export const getParentById = (id) => {
  return parents.find(parent => parent.id === id);
};

export const getBookingsBySitter = (sitterId) => {
  return bookings.filter(booking => booking.sitterId === sitterId);
};

export const getBookingsByParent = (parentId) => {
  return bookings.filter(booking => booking.parentId === parentId);
};

export const getReviewsBySitter = (sitterId) => {
  return reviews.filter(review => review.sitterId === sitterId);
};

export const getAdventureBySitter = (sitterId) => {
  return adventures.filter(adventure => adventure.sitterId === sitterId);
};

export const getChildrenByParent = (parentId) => {
  return children.filter(child => child.parentId === parentId);
};

export const getReviewsByParent = (parentId) => {
  return reviews.filter(review => review.parentId === parentId);
};

export const getMessagesByUser = (userId, userType) => {
  const userKey = `${userType}-${userId}`;
  return messages.filter(msg => msg.participants.includes(userKey));
};

export const getNotificationsByUser = (userId, userType) => {
  return notifications.filter(
    notif => notif.userId === `${userType}-${userId}` || notif.userId === userId
  );
};
