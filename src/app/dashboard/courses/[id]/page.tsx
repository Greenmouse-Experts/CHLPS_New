import CourseLearnPage from "@/features/courses/pages/course_learn_page";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CourseLearnPage id={id} />;
}
