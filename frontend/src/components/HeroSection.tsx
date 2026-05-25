import Link from "next/link";
import { TrendingUp } from "lucide-react";

const HeroSection = ({
    article,
}: any) => {
    if (!article) return null;

    return (
        <section className="mb-16">
            <Link
                href={`/article/${article._id}`}
            >
                <div className="relative overflow-hidden rounded-3xl h-125 group">
                    {/* IMAGE */}
                    {article.imageUrl ? (
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                    ) : (
                        <div className="w-full h-full bg-linear-to-br from-blue-500/20 via-zinc-900 to-black flex items-center justify-center">
                            <div className="text-center">
                                <TrendingUp className="w-10 h-10 text-blue-400 mx-auto mb-3" />

                                <p className="text-zinc-400 text-sm">
                                    News Aggregator
                                </p>
                            </div>
                        </div>
                    )}

                    {/* OVERLAY */}
                    <div className="absolute inset-0 bg-linear-to-t from-black via-black/40 to-transparent" />

                    {/* CONTENT */}
                    <div className="absolute bottom-0 p-10 max-w-4xl">
                        <span className="inline-block mb-4 px-4 py-2 rounded-full bg-blue-500/20 border border-blue-400/20 text-blue-300 text-sm">
                            Trending Now
                        </span>

                        <h1 className="text-5xl font-bold text-white leading-tight mb-6">
                            {article.title}
                        </h1>

                        <p className="text-zinc-300 text-lg line-clamp-2 mb-6">
                            {article.description}
                        </p>

                        <div className="flex items-center gap-4 text-sm text-zinc-400">
                            <span>
                                {article.source}
                            </span>

                            <span>•</span>

                            <span>
                                {new Date(
                                    article.publishedAt
                                ).toLocaleDateString()}
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </section>
    );
};

export default HeroSection;