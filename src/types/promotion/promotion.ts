enum PromotionType {
  Percentage = "PERCENTAGE",
  Nominal= "NOMINAL"
}

export interface PromotionProps {
  id: number,
  name: string,
  description: string,
  type: PromotionType,
  value: number,
  isReferralPromotion: boolean
}