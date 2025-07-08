export const getRTKErrorMessage = (error: any) => {
  if ('data' in error) return error.data?.message || 'Server error';
  if ('message' in error) return error.message;
  return 'An error occurred';
};