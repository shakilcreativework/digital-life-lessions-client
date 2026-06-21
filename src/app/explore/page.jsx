import Container from "@/components/shared/Container";
import { getAllLessons } from "@/lib/actions/lessons";

const PublicPage = async() => {
    const lessons = await getAllLessons();
    console.log(lessons);
    
    return (
        <main className="py-20 md:py-24">
            <Container>
                Explore
            </Container>
        </main>
    );
};

export default PublicPage;