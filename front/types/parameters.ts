export interface params {
  id: string;
}

export interface EditCourseFormProps {
  params: Promise<{
    id: string;
  }>;
}