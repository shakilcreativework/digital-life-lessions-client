export const getAllFeatured = async () => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

    try {
        const response = await fetch(`${baseUrl}/api/featured-lessons`, {
            cache: "no-store",
            headers: { "Content-Type": "application/json" }
        });

        if (!response.ok) throw new Error(`Status: ${response.status}`);

        const result = await response.json();
        
        // Return the 'data' array specifically
        return result.data || []; 
    } catch (error) {
        console.error("❌ Failed to fetch:", error);
        return [];
    }
};