import Container from "@/components/shared/Container";
import LessonCard from "@/components/ui/TestLessonCard";
// import LessonsDisplayList from "@/components/ui/LessonsDisplayList";
import { getAllLessons } from "@/lib/actions/lessons";

const PublicPage = async () => {
    const lessons = await getAllLessons();
    // console.log(lessons);

    return (
        <main className="py-20 md:py-24">
            <Container>
                {/* <LessonsDisplayList lessons={lessons} /> */}
                {
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                        {lessons.map((item) => (
                            // 🎯 Passed only one prop named 'lesson'!
                            <LessonCard key={item._id} lesson={item} />
                        ))}
                    </div>
                }
            </Container>
        </main>
    );
};

export default PublicPage;