import Container from "@/components/shared/Container";
import LessonCard from "@/components/ui/TestLessonCard";
import EmptyState from "@/components/ui/EmptyState"; 
import { getAllLessons } from "@/lib/actions/lessons";

const PublicPage = async () => {
    const lessons = await getAllLessons();

    return (
        <main className="py-10">
            <Container>
                {/* 🎯 Checks data state: if missing, displays the self-contained static UI */}
                {!lessons || lessons.length === 0 ? (
                    <div className="w-full py-12 flex justify-center items-center">
                        <EmptyState />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-4">
                        {lessons.map((item) => (
                            <LessonCard key={item._id} lesson={item} />
                        ))}
                    </div>
                )}
            </Container>
        </main>
    );
};

export default PublicPage;