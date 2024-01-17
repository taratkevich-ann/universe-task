import check from "../modules/choose-plan-page/assets/check.svg";
import cross from "../modules/choose-plan-page/assets/cross.svg";
import { PaymentPlanId, Product } from "../use-cases/get-subscription-products";
import {
  getAnnualFormattedPrice,
  getCurrency,
  getTrialFormattedPrice,
} from "./priceHelpers";
import React from "react";

export type Bullets = {
  imgSrc: string;
  bullText: JSX.Element;
};

export interface Plan {
  id: PaymentPlanId;
  title: string;
  price: string;
  date: string | null;
  bullets: Bullets[];
  bulletsC?: Bullets[];
  text: string | JSX.Element;
  formattedCurrency?: string;
  fullPrice?: string;
}

const createBullet = (type: "check" | "cross", text: string): Bullets => {
  const isCross = type === "cross";

  return {
    imgSrc: isCross ? cross : check,
    bullText: <span className={isCross ? "text-[#878787]" : ""}>{text}</span>,
  };
};

export const getPlan = (
  product: Product,
  t: (key: string, options?: Record<string, string>) => string
): Plan => {
  const { name, price } = product;
  switch (product.name) {
    case PaymentPlanId.ANNUAL:
      return {
        id: product.name as PaymentPlanId,
        title: t("payment_page.plans.annual.title"),
        price: getAnnualFormattedPrice(
          product.price?.price,
          product.price?.currency
        ),
        date: t("payment_page.plans.annual.date"),
        bullets: [
          createBullet("check", t("payment_page.plans.annual.bullet1")),
          createBullet("check", t("payment_page.plans.annual.bullet2")),
          createBullet("check", t("payment_page.plans.annual.bullet3")),
          createBullet("check", t("payment_page.plans.annual.bullet4")),
          createBullet("check", t("payment_page.plans.annual.bullet5")),
          createBullet("check", t("payment_page.plans.annual.bullet6")),
          createBullet("check", t("payment_page.plans.annual.bullet7")),
          createBullet("check", t("payment_page.plans.annual.bullet8")),
        ],
        text: t("payment_page.plans.annual.text", {
          formattedPrice: getTrialFormattedPrice(
            product.price?.price,
            product.price?.currency
          ),
        }),
      };
    case PaymentPlanId.MONTHLY:
      return {
        id: name,
        title: t("payment_page.plans.monthly.title"),
        price: getTrialFormattedPrice(price.trial_price, price.currency),
        fullPrice: getTrialFormattedPrice(price.price, price.currency),
        formattedCurrency: getCurrency(price.currency),
        date: null,
        bullets: [
          createBullet("check", t("payment_page.plans.monthly.bullet1")),
          createBullet("check", t("payment_page.plans.monthly.bullet2")),
          createBullet("check", t("payment_page.plans.monthly.bullet3")),
          createBullet("cross", t("payment_page.plans.monthly.bullet4")),
          createBullet("cross", t("payment_page.plans.monthly.bullet5")),
          createBullet("cross", t("payment_page.plans.monthly.bullet6")),
          createBullet("cross", t("payment_page.plans.monthly.bullet7")),
          createBullet("cross", t("payment_page.plans.monthly.bullet8")),
        ],
        text: t("payment_page.plans.monthly.text", {
          formattedPrice: getTrialFormattedPrice(price.price, price.currency),
        }),
      };
    case PaymentPlanId.MONTHLY_FULL:
      return {
        id: name,
        title: t("payment_page.plans.monthly_full.title"),
        price: getTrialFormattedPrice(price?.trial_price, price?.currency),
        fullPrice: getTrialFormattedPrice(price?.price, price?.currency),
        formattedCurrency: getCurrency(price.currency),
        date: null,
        bullets: [
          createBullet("check", t("payment_page.plans.monthly_full.bullet1")),
          createBullet("check", t("payment_page.plans.monthly_full.bullet2")),
          createBullet("check", t("payment_page.plans.monthly_full.bullet3")),
          createBullet("check", t("payment_page.plans.monthly_full.bullet4")),
          createBullet("check", t("payment_page.plans.monthly_full.bullet5")),
          createBullet("check", t("payment_page.plans.monthly_full.bullet6")),
          createBullet("check", t("payment_page.plans.monthly_full.bullet7")),
          createBullet("check", t("payment_page.plans.monthly_full.bullet8")),
        ],
        text: t("payment_page.plans.monthly_full.text", {
          formattedPrice: getTrialFormattedPrice(price?.price, price?.currency),
        }),
      };
  }
};
