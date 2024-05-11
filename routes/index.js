import express from 'express'
const router = express.Router();
import { db } from "../models/index.js"

router.get('/curriculum', async (req, res) => {
    const curriculum = await db.Curriculum.aggregate([
        { $lookup: { from: "courses", foreignField: "cid", localField: "cid", as: "course" } },
        { $unwind: "$course" }, { $project: { _id: 1, curid: 1, cid: 1, title: "$course.title", semno: 1 } }]).sort('semno')
    res.status(200).json(curriculum);
});

router.get('/faculties', async (req, res) => {
    const { semester } = req.query;

    const faculties = await db.Faculty.aggregate([
        {
            $lookup: {
                from: "offers",
                foreignField: "fid",
                localField: "fid",
                pipeline: [
                    { $match: { semester } },
                    {
                        $group: {
                            _id: {
                                fid: "$fid"
                            },
                            count: {
                                $count: {}
                            }
                        }
                    },
                    {
                        $project: {
                            _id: 0,
                            fid: "$_id.fid",
                            assign: "$count"
                        }
                    }],
                as: 'alot'
            }
        },
        { $unwind: { path: "$alot", preserveNullAndEmptyArrays: true } },
        { $project: { _id: 1, fid: 1, TeacherName: 1, fulltime: 1, alot: "$alot.assign" } }
    ]).sort({ fid: 1 });
    res.status(200).json(faculties);
});

router.get('/offers', async (req, res) => {
    const offers = await db.Offer.find();
    res.status(200).json(offers);
});

// router.get('/assign', async (req, res) => {
//     const { semester } = req.query;
//     const assign = await db.Offer.aggregate([
//         { $match: { semester } },
//         { $group: { _id: { fid: "$fid", fulltime: "$fulltime" }, count: { $count: {} } } },
//         { $project: { _id: 0, fid: "$_id.fid", assign: "$count", fulltime: 1 } }
//     ]);
//     res.status(200).json(assign);
// });

router.get('/areas', async (req, res) => {
    const areas = await db.Area.find();
    res.status(200).json(areas);
});

router.delete('/clear', async (req, res) => {
    const answer = await db.Offer.deleteMany();
    res.status(200).json(answer);
});

router.post('/assign', async (req, res) => {
    const offer = req.body;
    const answer = await db.Offer.create(offer);
    res.status(200).json(answer);
});

export default router;