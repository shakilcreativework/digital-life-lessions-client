// export const getAllLessons = async () => {
//     const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/lessons`, {
//         cache: "no-store",
//     })
//     const lessons = await response.json();
//     return lessons;
// };


export const getAllLessons = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
        const response = await fetch(`${baseUrl}/api/lessons`, {
            cache: "no-store",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`Server Action fetch failed with status: ${response.status}`);
        }

        const lessons = await response.json();
        return lessons;
    } catch (error) {
        console.error("❌ Failed to resolve lessons from Express cluster:", error);
        // Fallback array prevents map layout crashes in your UI components
        return [];
    }
};