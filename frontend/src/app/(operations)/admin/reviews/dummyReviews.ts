export interface Review {
  id: string;
  orderId: string;
  rating: number;
  date: string;
  title: string;
  content: string;
  reviewer: {
    name: string;
    avatar?: string;
  };
  product: {
    name: string;
    image: string;
  };
  status: 'published' | 'archived' | 'pending';
}

export const dummyReviews: Review[] = [
  {
    id: 'rev-001',
    orderId: 'Order-99121',
    rating: 2,
    date: 'Oct 12, 2023',
    title: 'Disappointed with quality',
    content: "I'm disappointed. The fish wasn't as fresh as expected, especially given the premium price point.",
    reviewer: {
      name: 'Test Dummy A',
      avatar: 'https://ui-avatars.com/api/?name=Test+Dummy+A&background=random',
    },
    product: {
      name: 'Fresh Seer Fish (Vanjiram)',
      image: '/logo.jpeg',
    },
    status: 'pending',
  },
  {
    id: 'rev-002',
    orderId: 'Order-99122',
    rating: 5,
    date: 'Oct 14, 2023',
    title: 'Excellent quality!',
    content: "Absolutely wonderful. The prawns were perfectly sized and extremely fresh. Will definitely order again.",
    reviewer: {
      name: 'Test Dummy B',
      avatar: 'https://ui-avatars.com/api/?name=Test+Dummy+B&background=random',
    },
    product: {
      name: 'Tiger Prawns Large',
      image: '/logo.jpeg',
    },
    status: 'published',
  },
  {
    id: 'rev-003',
    orderId: 'Order-99123',
    rating: 3,
    date: 'Oct 15, 2023',
    title: 'Average experience',
    content: "The delivery was a bit late, but the crabs were okay. Packaging could be improved.",
    reviewer: {
      name: 'Test Dummy C',
      avatar: 'https://ui-avatars.com/api/?name=Test+Dummy+C&background=random',
    },
    product: {
      name: 'Mud Crab',
      image: '/logo.jpeg',
    },
    status: 'pending',
  },
  {
    id: 'rev-004',
    orderId: 'Order-99124',
    rating: 1,
    date: 'Oct 16, 2023',
    title: 'Terrible packaging',
    content: "The ice melted completely by the time it reached me. Very disappointed with the delivery service.",
    reviewer: {
      name: 'Test Dummy D',
      avatar: 'https://ui-avatars.com/api/?name=Test+Dummy+D&background=random',
    },
    product: {
      name: 'Indian Salmon (Rawas)',
      image: '/logo.jpeg',
    },
    status: 'pending',
  },
  {
    id: 'rev-005',
    orderId: 'Order-99125',
    rating: 4,
    date: 'Oct 18, 2023',
    title: 'Good value for money',
    content: "Fresh and clean cut. The portion size was slightly smaller than expected but quality was top notch.",
    reviewer: {
      name: 'Test Dummy E',
      avatar: 'https://ui-avatars.com/api/?name=Test+Dummy+E&background=random',
    },
    product: {
      name: 'Pomfret White',
      image: '/logo.jpeg',
    },
    status: 'published',
  },
  {
    id: 'rev-006',
    orderId: 'Order-99126',
    rating: 2,
    date: 'Oct 19, 2023',
    title: 'Not up to the mark',
    content: "I'm disappointed. The video quality isn't as sharp as expected, especially in low light... Wait, this is a fish store?",
    reviewer: {
      name: 'Test Dummy F',
      avatar: 'https://ui-avatars.com/api/?name=Test+Dummy+F&background=random',
    },
    product: {
      name: 'Squid Rings',
      image: '/logo.jpeg',
    },
    status: 'archived',
  },
];
