import Link from "next/link";
export default function NotFound() {
    return (
        <div className="flex h-full items-center justify-center">
            <h1 className="text-4xl font-bold text-center">
                     404  - Not Found <br />
                <Link href="/" className="text-xl">Click to Home</Link>
            </h1>

        </div>
    );
}