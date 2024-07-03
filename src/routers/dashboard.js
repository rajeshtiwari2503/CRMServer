const express = require("express");
const router = new express.Router();
const { 
  BrandRegistrationModel, 
  ServiceModel, 
  TechnicianModal, 
  EmployeeModel, 
  DealerModel, 
  UserModel 
} = require('../models/registration');
const Orders = require("../models/order");
const SpareParts = require("../models/sparePart");
const ProductModel = require("../models/product");
const Complaints = require("../models/complaint");
const ComplaintModal = require("../models/complaint");

router.get("/dashboardDetails", async (req, res) => {
  try {
    const [
      customerCount, 
      orderCount, 
      serviceCount, 
      technicianCount, 
      dealerCount, 
      sparePartCount, 
      brandCount,
      allComplaintCount,
      complaintNewCount,
      complaintAssignCount,
      complaintPendingCount,
      complaintCompleteCount,
      complaintCancelCount,
      complaintPartPendingCount
    ] = await Promise.all([
      UserModel.countDocuments({}),
      Orders.countDocuments({}),
      ServiceModel.countDocuments({}),
      TechnicianModal.countDocuments({}),
      DealerModel.countDocuments({}),
      SpareParts.countDocuments({}),
      BrandRegistrationModel.countDocuments({}),
      Complaints.countDocuments({ }),
      Complaints.countDocuments({ status: 'NEW' }),
      Complaints.countDocuments({ status: 'ASSIGN' }),
      Complaints.countDocuments({ status: 'PENDING' }),
      Complaints.countDocuments({ status: 'COMPLETED' }),
      Complaints.countDocuments({ status: 'CANCELED' }),
      Complaints.countDocuments({ status: 'PART PENDIND' })
    ]);

    res.json({
      customers: customerCount,
      orders: orderCount,
      services: serviceCount,
      technicians: technicianCount,
      dealers: dealerCount,
      spareParts: sparePartCount,
      brands: brandCount,
      complaints: {
        allComplaints: allComplaintCount,
        new: complaintNewCount,
        assign: complaintAssignCount,
        pending: complaintPendingCount,
        complete: complaintCompleteCount,
        cancel: complaintCancelCount,
        partPending: complaintPartPendingCount
      }
    });
  } catch (err) {
    res.status(500).send(err);
  }
});


router.get('/getUserAndProduct', async (req, res) => {
  try {
    const [
      customers, 
      services, 
      technicians, 
      dealers,  
      brands,
      product
    ] = await Promise.all([
      UserModel.find({}),
      ServiceModel.find({}),
      TechnicianModal.find({}),
      DealerModel.find({}),
      BrandRegistrationModel.find({}),
      ProductModel.find({})
    ]);

    res.json({
      customers: customers,
      services: services,
      technicians: technicians,
      dealers: dealers,
      brands: brands,
      product: product,
    });
  } catch (err) {
    console.error('Error fetching dashboard details:', err);
    res.status(500).send(err);
  }
});

// router.get("/dashboardDetailsBySeviceCenterId/:id", async (req, res) => {
//   try {
//     const id = req.params.id;
//     const query = {assignServiceCenterId:id};
//     const [
//       allComplaintCount,
//       complaintNewCount,
//       complaintAssignCount,
//       complaintPendingCount,
//       complaintCompleteCount,
//       complaintCancelCount,
//       complaintPartPendingCount
//     ] = await Promise.all([
//       Complaints.countDocuments(query),
//       Complaints.countDocuments({ ...query, status: 'NEW' }),
//       Complaints.countDocuments({ ...query, status: 'ASSIGN' }),
//       Complaints.countDocuments({ ...query, status: 'PENDING' }),
//       Complaints.countDocuments({ ...query, status: 'COMPLETED' }),
//       Complaints.countDocuments({ ...query, status: 'CANCELED' }),
//       Complaints.countDocuments({ ...query, status: 'PART PENDING' })
//     ]);

//     res.json({
//       complaints: {
//         allComplaints: allComplaintCount,
//         new: complaintNewCount,
//         assign: complaintAssignCount,
//         pending: complaintPendingCount,
//         complete: complaintCompleteCount,
//         cancel: complaintCancelCount,
//         partPending: complaintPartPendingCount
//       }
//     });
//   } catch (err) {
//     console.error('Error in /dashboardDetailsById/:id:', err);
//     res.status(500).send(err);
//   }
// });


router.get("/dashboardDetailsBySeviceCenterId/:id", async (req, res) => {
  try {
    const id = req.params.id;

    // Get the current date and calculate the start dates for the current month, week, and day
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
    // Query to filter complaints by assignServiceCenterId
    const query = { assignServiceCenterId: id };

    // Fetch counts for all complaints and complaints with specific statuses
    const [
      allComplaintCount,
      complaintNewCount,
      complaintAssignCount,
      complaintPendingCount,
      complaintCompleteCount,
      complaintCancelCount,
      complaintPartPendingCount,
      monthlyNewCount,
      monthlyAssignCount,
      monthlyPendingCount,
      monthlyCompleteCount,
      monthlyCancelCount,
      weeklyNewCount,
      weeklyAssignCount,
      weeklyPendingCount,
      weeklyCompleteCount,
      weeklyCancelCount,
      dailyNewCount,
      dailyAssignCount,
      dailyPendingCount,
      dailyCompleteCount,
      dailyCancelCount
    ] = await Promise.all([
      // Total counts
      Complaints.countDocuments(query),
      Complaints.countDocuments({ ...query, status: 'NEW' }),
      Complaints.countDocuments({ ...query, status: 'ASSIGN' }),
      Complaints.countDocuments({ ...query, status: 'PENDING' }),
      Complaints.countDocuments({ ...query, status: 'COMPLETED' }),
      Complaints.countDocuments({ ...query, status: 'CANCELED' }),
      Complaints.countDocuments({ ...query, status: 'PART PENDING' }),

      // Monthly counts
      Complaints.countDocuments({ ...query, status: 'NEW', createdAt: startOfMonth }),
      Complaints.countDocuments({ ...query, status: 'ASSIGN', createdAt: { $gte: startOfMonth } }),
      Complaints.countDocuments({ ...query, status: 'PENDING', createdAt: { $gte: startOfMonth } }),
      Complaints.countDocuments({ ...query, status: 'COMPLETED', createdAt: { $gte: startOfMonth } }),
      Complaints.countDocuments({ ...query, status: 'CANCELED', createdAt: { $gte: startOfMonth } }),

      // Weekly counts
      Complaints.countDocuments({ ...query, status: 'NEW', createdAt: { $gte: startOfWeek } }),
      Complaints.countDocuments({ ...query, status: 'ASSIGN', createdAt: { $gte: startOfWeek } }),
      Complaints.countDocuments({ ...query, status: 'PENDING', createdAt: { $gte: startOfWeek } }),
      Complaints.countDocuments({ ...query, status: 'COMPLETED', createdAt: { $gte: startOfWeek } }),
      Complaints.countDocuments({ ...query, status: 'CANCELED', createdAt: { $gte: startOfWeek } }),

      // Daily counts
      Complaints.countDocuments({ ...query, status: 'NEW', createdAt: { $gte: startOfDay } }),
      Complaints.countDocuments({ ...query, status: 'ASSIGN', createdAt: { $gte: startOfDay } }),
      Complaints.countDocuments({ ...query, status: 'PENDING', createdAt: { $gte: startOfDay } }),
      Complaints.countDocuments({ ...query, status: 'COMPLETED', createdAt: { $gte: startOfDay } }),
      Complaints.countDocuments({ ...query, status: 'CANCELED', createdAt: { $gte: startOfDay } })
    ]);

    // Return aggregated data as JSON response
    res.json({
      complaints: {
        allComplaints: allComplaintCount,
        new: complaintNewCount,
        assign: complaintAssignCount,
        pending: complaintPendingCount,
        complete: complaintCompleteCount,
        cancel: complaintCancelCount,
        partPending: complaintPartPendingCount,
        monthly: {
          new: monthlyNewCount,
          assign: monthlyAssignCount,
          pending: monthlyPendingCount,
          complete: monthlyCompleteCount,
          cancel: monthlyCancelCount
        },
        weekly: {
          new: weeklyNewCount,
          assign: weeklyAssignCount,
          pending: weeklyPendingCount,
          complete: weeklyCompleteCount,
          cancel: weeklyCancelCount
        },
        daily: {
          new: dailyNewCount,
          assign: dailyAssignCount,
          pending: dailyPendingCount,
          complete: dailyCompleteCount,
          cancel: dailyCancelCount
        }
      }
    });

  } catch (err) {
    console.error('Error in /dashboardDetailsBySeviceCenterId/:id:', err);
    res.status(500).send(err);
  }
});
 
 
 

router.get("/dashboardDetailsByTechnicianId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = {technicianId:id};
    const [
      allComplaintCount,
      complaintNewCount,
      complaintAssignCount,
      complaintPendingCount,
      complaintCompleteCount,
      complaintCancelCount,
      complaintPartPendingCount
    ] = await Promise.all([
      Complaints.countDocuments(query),
      Complaints.countDocuments({ ...query, status: 'NEW' }),
      Complaints.countDocuments({ ...query, status: 'ASSIGN' }),
      Complaints.countDocuments({ ...query, status: 'PENDING' }),
      Complaints.countDocuments({ ...query, status: 'COMPLETED' }),
      Complaints.countDocuments({ ...query, status: 'CANCELED' }),
      Complaints.countDocuments({ ...query, status: 'PART PENDING' })
    ]);

    res.json({
      complaints: {
        allComplaints: allComplaintCount,
        new: complaintNewCount,
        assign: complaintAssignCount,
        pending: complaintPendingCount,
        complete: complaintCompleteCount,
        cancel: complaintCancelCount,
        partPending: complaintPartPendingCount
      }
    });
  } catch (err) {
    console.error('Error in /dashboardDetailsById/:id:', err);
    res.status(500).send(err);
  }
});

router.get("/dashboardDetailsByDealerId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = {dealerId:id};
    const [
      allComplaintCount,
      complaintNewCount,
      complaintAssignCount,
      complaintPendingCount,
      complaintCompleteCount,
      complaintCancelCount,
      complaintPartPendingCount
    ] = await Promise.all([
      Complaints.countDocuments(query),
      Complaints.countDocuments({ ...query, status: 'NEW' }),
      Complaints.countDocuments({ ...query, status: 'ASSIGN' }),
      Complaints.countDocuments({ ...query, status: 'PENDING' }),
      Complaints.countDocuments({ ...query, status: 'COMPLETED' }),
      Complaints.countDocuments({ ...query, status: 'CANCELED' }),
      Complaints.countDocuments({ ...query, status: 'PART PENDING' })
    ]);

    res.json({
      complaints: {
        allComplaints: allComplaintCount,
        new: complaintNewCount,
        assign: complaintAssignCount,
        pending: complaintPendingCount,
        complete: complaintCompleteCount,
        cancel: complaintCancelCount,
        partPending: complaintPartPendingCount
      }
    });
  } catch (err) {
    console.error('Error in /dashboardDetailsById/:id:', err);
    res.status(500).send(err);
  }
});


router.get("/dashboardDetailsByUserId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = {userId:id};
    const [
      allComplaintCount,
      complaintNewCount,
      complaintAssignCount,
      complaintPendingCount,
      complaintCompleteCount,
      complaintCancelCount,
      complaintPartPendingCount
    ] = await Promise.all([
      Complaints.countDocuments(query),
      Complaints.countDocuments({ ...query, status: 'NEW' }),
      Complaints.countDocuments({ ...query, status: 'ASSIGN' }),
      Complaints.countDocuments({ ...query, status: 'PENDING' }),
      Complaints.countDocuments({ ...query, status: 'COMPLETED' }),
      Complaints.countDocuments({ ...query, status: 'CANCELED' }),
      Complaints.countDocuments({ ...query, status: 'PART PENDING' })
    ]);

    res.json({
      complaints: {
        allComplaints: allComplaintCount,
        new: complaintNewCount,
        assign: complaintAssignCount,
        pending: complaintPendingCount,
        complete: complaintCompleteCount,
        cancel: complaintCancelCount,
        partPending: complaintPartPendingCount
      }
    });
  } catch (err) {
    console.error('Error in /dashboardDetailsById/:id:', err);
    res.status(500).send(err);
  }
});

router.get("/dashboardDetailsByBrandId/:id", async (req, res) => {
  try {
    const id = req.params.id;
    const query = {brandId:id};
    const [
      allComplaintCount,
      complaintNewCount,
      complaintAssignCount,
      complaintPendingCount,
      complaintCompleteCount,
      complaintCancelCount,
      complaintPartPendingCount
    ] = await Promise.all([
      Complaints.countDocuments(query),
      Complaints.countDocuments({ ...query, status: 'NEW' }),
      Complaints.countDocuments({ ...query, status: 'ASSIGN' }),
      Complaints.countDocuments({ ...query, status: 'PENDING' }),
      Complaints.countDocuments({ ...query, status: 'COMPLETED' }),
      Complaints.countDocuments({ ...query, status: 'CANCELED' }),
      Complaints.countDocuments({ ...query, status: 'PART PENDING' })
    ]);

    res.json({
      complaints: {
        allComplaints: allComplaintCount,
        new: complaintNewCount,
        assign: complaintAssignCount,
        pending: complaintPendingCount,
        complete: complaintCompleteCount,
        cancel: complaintCancelCount,
        partPending: complaintPartPendingCount
      }
    });
  } catch (err) {
    console.error('Error in /dashboardDetailsById/:id:', err);
    res.status(500).send(err);
  }
});




module.exports = router;
