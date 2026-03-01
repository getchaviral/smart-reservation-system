import { Reserve } from "../Modals/Reserve.js";
import express from 'express'

const AllReserves = express();

const toNumber = (value, fallback) => {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : fallback;
};

AllReserves.get('/reserves', async (req, res) => {
    try {
        const page = Math.max(1, toNumber(req.query.page, 1));
        const limit = Math.min(50, Math.max(1, toNumber(req.query.limit, 9)));
        const category = req.query.category?.trim();
        const search = req.query.search?.trim();
        const minPrice = toNumber(req.query.minPrice, null);
        const maxPrice = toNumber(req.query.maxPrice, null);
        const minRating = toNumber(req.query.minRating, null);
        const maxRating = toNumber(req.query.maxRating, null);
        const sortBy = req.query.sortBy === "price" ? "priceNum" : "ratingNum";
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

        const match = {};

        if (category) {
            match.category = category;
        }

        if (search) {
            match.$or = [
                { MainTitle: { $regex: search, $options: "i" } },
                { location: { $regex: search, $options: "i" } },
            ];
        }

        const numericMatch = {};
        if (minPrice !== null || maxPrice !== null) {
            numericMatch.priceNum = {};
            if (minPrice !== null) numericMatch.priceNum.$gte = minPrice;
            if (maxPrice !== null) numericMatch.priceNum.$lte = maxPrice;
        }

        if (minRating !== null || maxRating !== null) {
            numericMatch.ratingNum = {};
            if (minRating !== null) numericMatch.ratingNum.$gte = minRating;
            if (maxRating !== null) numericMatch.ratingNum.$lte = maxRating;
        }

        const pipeline = [
            { $match: match },
            {
                $addFields: {
                    priceNum: { $toDouble: "$price" },
                    ratingNum: { $toDouble: "$rating" },
                },
            },
        ];

        if (Object.keys(numericMatch).length > 0) {
            pipeline.push({ $match: numericMatch });
        }

        pipeline.push(
            { $sort: { [sortBy]: sortOrder, _id: -1 } },
            {
                $facet: {
                    data: [
                        { $skip: (page - 1) * limit },
                        { $limit: limit },
                        { $project: { priceNum: 0, ratingNum: 0 } },
                    ],
                    total: [{ $count: "count" }],
                },
            }
        );

        const result = await Reserve.aggregate(pipeline);
        const items = result[0]?.data || [];
        const totalCount = result[0]?.total?.[0]?.count || 0;
        const totalPages = Math.max(1, Math.ceil(totalCount / limit));

        res.status(200).json({
            items,
            pagination: {
                page,
                limit,
                totalCount,
                totalPages,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to fetch reserves" });
    }
});

AllReserves.get('/', async(req,res)=>{

    try {
        const data = await Reserve.find({});
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Failed to fetch reserves" });
    }
})

export default AllReserves
