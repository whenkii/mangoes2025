const express = require("express");
const router = new express.Router();
const executeSqls = require("../db_scripts/executeSqls.js");

router
  .route("/products/:id?")
  .get(executeSqls.weakSqls);

  router
  .route("/getSqlresult/:sqltext")
  .get(executeSqls.adhocSqls);
  // .post(executeSqls.adhocSqlsViaPost);

  router
  .route("/adhocSqlsViaBodyPost")
  .post(executeSqls.adhocSqlsViaBodyPost);

  router
  .route("/createAccount")
  .post(executeSqls.createAccount);

  router
  .route("/executeProc_log_order")
  .post(executeSqls.executeProc_log_order);

  router
  .route("/addproduct")
  .post(executeSqls.addProduct);

  router
  .route("/updateproduct")
  .post(executeSqls.updateProduct);

  router
  .route("/execProcDynamic")
  .post(executeSqls.execProcDynamic);

  router
  .route("/execProcDynamicNoOutRec")
  .post(executeSqls.execProcDynamicNoOutRec);

  // router
  // .route("/execProcDynamicNoOutRec")
  // .post(executeSqls.execProcDynamicNoOutRec);

// router
//   .route("/insert_issue/:email?/:issue?")
//   // .get(logissue.funInsert)
//   .post(logissue.funInsert);
// // .put(logissue.funInsert);
// // .delete(logissue.funInsert)

module.exports = router;
