"use client";

import { useEffect, useState } from "react";

import api from "@/services/api";

import Navbar from "@/components/Navbar";

import FeedSection
    from "@/components/FeedSection";

const SearchPage = () => {
    const [query, setQuery] =
        useState("");

    const [category, setCategory] =
        useState("");

    const [articles, setArticles] =
        useState([]);

    const [loading, setLoading] =
        useState(false);

    const searchArticles =
        async () => {
            try {
                setLoading(true);

                const response =
                    await api.get(
                        "/articles/search",
                        {
                            params: {
                                q: query,
                                category,
                            },
                        }
                    );

                setArticles(response.data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

    useEffect(() => {
        const timer = setTimeout(() => {
            if (
                query.trim() ||
                category
            ) {
                searchArticles();
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [query, category]);

    return (
        <div className="bg-gray-100 min-h-screen">
            <Navbar />

            <div className="max-w-7xl mx-auto p-6">
                <h1 className="text-4xl font-bold mb-8">
                    Search Articles
                </h1>

                {/* Search Controls */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    <input
                        type="text"
                        placeholder="Search articles..."
                        value={query}
                        onChange={(e) =>
                            setQuery(e.target.value)
                        }
                        className="flex-1 border p-4 rounded-lg"
                    />

                    <select
                        value={category}
                        onChange={(e) =>
                            setCategory(
                                e.target.value
                            )
                        }
                        className="border p-4 rounded-lg"
                    >
                        <option value="">
                            All Categories
                        </option>

                        <option value="technology">
                            Technology
                        </option>

                        <option value="sports">
                            Sports
                        </option>

                        <option value="business">
                            Business
                        </option>

                        <option value="health">
                            Health
                        </option>

                        <option value="science">
                            Science
                        </option>

                        <option value="entertainment">
                            Entertainment
                        </option>
                    </select>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center py-10">
                        Searching...
                    </div>
                )}

                {/* Results */}
                {!loading &&
                    articles.length > 0 && (
                        <FeedSection
                            title="Search Results"
                            articles={articles}
                        />
                    )}

                {/* Empty State */}
                {!loading &&
                    articles.length === 0 &&
                    (query || category) && (
                        <div className="text-center py-20">
                            <h2 className="text-2xl font-semibold mb-3">
                                No Articles Found
                            </h2>

                            <p className="text-gray-500">
                                Try another search term or category.
                            </p>
                        </div>
                    )}
            </div>
        </div>
    );
};

export default SearchPage;