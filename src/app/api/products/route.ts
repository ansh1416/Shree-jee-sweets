import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const products = await prisma.product.findMany({
            orderBy: { name: "asc" },
        });

        return NextResponse.json(products);
    } catch (error) {
        console.error(error);
        return NextResponse.json([]);
    }
}