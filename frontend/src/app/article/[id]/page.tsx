"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import BookmarkButton from "@/components/BookmarkButton";
import api from "@/services/api";
import ArticleSkeleton from "@/components/ArticleSkeleton";
import { toast } from "react-hot-toast/headless";
const ArticlePage = () => {
    const params = useParams();
    const [article, setArticle] = useState<any>(null);
    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await api.get(`/articles/${params.id}`);
                setArticle(response.data);
            }
            catch (error) {
                toast.error("Failed to fetch article");
            }
        };
        fetchArticle();
    }, [params.id]);

    if (!article) {
        return (<ArticleSkeleton />);
    }
    return (
        <div className="max-w-4xl mx-auto p-6">
            {article.imageUrl && (<img src={article.imageUrl} alt={article.title} className="w-full rounded-xl mb-6" />)}
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            <div className="mb-6">
                <BookmarkButton
                    articleId={article._id}
                />
            </div>
            <div className="text-gray-500 mb-6">{article.source}</div>
            <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{
                    __html:
                        article.fullContent ||
                        article.content,
                }}
            />
        </div>
    );
};
export default ArticlePage;