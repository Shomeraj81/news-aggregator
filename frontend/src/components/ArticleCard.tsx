"use client";

import Link from "next/link";

import {
  Clock3,
  TrendingUp,
} from "lucide-react";

import { Article }
from "@/types/article";

interface Props {
  article: Article;
}

const ArticleCard = ({
  article,
}: Props) => {
  return (
    <Link
      href={`/article/${article._id}`}
      className="group"
    >
      <article className="news-card h-full flex flex-col">
        {/* IMAGE */}
        <div className="relative overflow-hidden h-56">
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
          <div className="absolute inset-0 bg-linear-to-t from-black/80 to-transparent opacity-80" />

          {/* CATEGORY BADGE */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md border border-white/10 text-xs font-medium text-white capitalize">
              {article.category}
            </span>
          </div>
        </div>

        {/* CONTENT */}
        <div className="flex flex-col flex-1 p-5">
          {/* SOURCE */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-sm text-blue-400 font-medium">
              {article.source}
            </span>

            <div className="flex items-center gap-1 text-zinc-500 text-xs">
              <Clock3 className="w-3 h-3" />

              {new Date(
                article.publishedAt
              ).toLocaleDateString()}
            </div>
          </div>

          {/* TITLE */}
          <h2 className="text-xl font-semibold leading-tight text-white mb-4 line-clamp-2 group-hover:text-blue-400 transition-colors">
            {article.title}
          </h2>

          {/* DESCRIPTION */}
          <p className="text-zinc-400 text-sm leading-7 line-clamp-3 flex-1">
            {article.description}
          </p>

          {/* FOOTER */}
          <div className="mt-6 pt-4 border-t border-zinc-800 flex items-center justify-between">
            <span className="text-xs text-zinc-500">
              Trending Score
            </span>

            <span className="text-sm font-semibold text-white">
              {article.trendingScore?.toFixed(
                1
              ) || "0.0"}
            </span>
          </div>
        </div>
      </article>
    </Link>
  );
};

export default ArticleCard;