export interface CoverTheme {
  id: string;
  name: string;
  backgroundColor: string;
  textColor: string;
  description: string;
}

export const coverThemes: CoverTheme[] = [
  {
    id: 'all-white',
    name: 'Black & White',
    backgroundColor: '#fafafa',
    textColor: '#1E1E1E',
    description: 'A clean and professional look with high contrast',
  },
  {
    id: 'all-black',
    name: 'All Black',
    backgroundColor: '#1E1E1E',
    textColor: '#ffffff',
    description: 'A clean and professional look with high contrast',
  },
  {
    id: 'classic-blue',
    name: 'Classic Blue',
    backgroundColor: '#2196F3',
    textColor: '#FFFFFF',
    description: 'A clean and professional look with high contrast',
  },
  {
    id: 'coral-pink',
    name: 'Coral Pink',
    backgroundColor: '#E91E63',
    textColor: '#FFFFFF',
    description: 'A clean and professional look with high contrast',
  },
];
