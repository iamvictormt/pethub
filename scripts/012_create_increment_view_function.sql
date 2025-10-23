-- Create a function to safely increment pet view count
CREATE OR REPLACE FUNCTION increment_pet_view(pet_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE pets
  SET view_count = COALESCE(view_count, 0) + 1
  WHERE id = pet_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION increment_pet_view(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION increment_pet_view(UUID) TO anon;
