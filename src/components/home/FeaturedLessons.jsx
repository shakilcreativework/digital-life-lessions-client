"use client";


// Swiper Structural Styles
import "swiper/css";
import LessonCard from "../ui/LessonCard";
import Container from "../shared/Container";
import EmptyState from "../ui/EmptyState";
import { useEffect, useState } from "react";
import { getAllFeatured } from "@/lib/actions/featured";
import GlobalLoading from "@/app/loading";

const FeaturedLessons = () => {
    const [features, setFeatured] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadFeatured = async () => {
            try {
                const feaData = await getAllFeatured();
                setFeatured(feaData);
            } catch (error) {
                console.error("Featured data load error", error);
            } finally {
                setLoading(false);
            }
        };

        loadFeatured();
    }, []); // Empty array ensures this fires exactly once when the component mounts

    // console.log(features);
    
    if(loading){
        return GlobalLoading();
    }

    return (
        <main className="py-10">
            <Container>
                {/* Header Layout */}
                <div className="flex items-center justify-between mb-10">
                    <h2 className="text-2xl md:text-3xl font-bold text-foreground tracking-tight">
                        Featured Lessons
                    </h2>

                    <button className="text-sm font-medium text-muted underline underline-offset-4 decoration-2 hover:text-foreground transition-all">
                        View all lessons &rarr;
                    </button>
                </div>

                {/* 🎯 Checks data state: if missing, displays the self-contained static UI */}
                {!features || features?.length === 0 ? (
                    <div className="w-full py-12 flex justify-center items-center">
                        <EmptyState />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6 ">
                        {features?.slice(0, 12).map((item) => (
                            <LessonCard key={item._id} lesson={item} />
                        ))}
                    </div>
                )}
            </Container>
        </main>
    );
};

export default FeaturedLessons;