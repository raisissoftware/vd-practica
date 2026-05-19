import { prisma } from "@/lib/db";

export async function getHomepageData() {
    return await prisma.page.findUnique({
        where: {
            slug: "homepage",
        },
        include: {
            sections: {
                orderBy: {
                    order: "asc",
                },
            },
        },
    });
}