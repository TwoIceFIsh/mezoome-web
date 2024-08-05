import db from "@/lib/prismadb";

export const getLearnings = async () => {
    const count = await db.learning.count()
    return {
        data: await db.learning.findMany({
            orderBy: {
                createdAt: "desc",
            },

            take: 20,
        }), count: count
    }
}