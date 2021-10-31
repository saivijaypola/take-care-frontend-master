import gql from "graphql-tag";
export default gql(`
query getCouponByCouponTitle($couponTitle: String!){
    tblCouponByCouponTitle(couponTitle: $couponTitle){
      nodeId
      couponId
      couponTitle
      couponDescription
      percentageReduction
      maxUsage
      expireOn
      createdAt
      updatedAt
      deletedAt
      maxDeduction
    }
  }
`)