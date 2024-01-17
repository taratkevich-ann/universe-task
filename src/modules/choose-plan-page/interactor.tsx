// import { EDIT_FILENAME_LC_KEY, EDIT_FILE_LC_KEY } from '@/common/constants'
import {
  InternalFileType,
  PAGE_LINKS,
  imagesFormat,
} from "../../constants/interactorConstants";
import { isValidFileExtension } from "../../helpers/fileHelpers";
import { Plan, getPlan } from "../../helpers/plansHelpers";
import { useRemoteConfig } from "../../providers/remote-config-provider";
import { useUser } from "../../providers/user-provider";
import { API } from "../../services/api";
import { ApiFile } from "../../services/api/types";
import { generatePDFCover } from "../../use-cases/generate-pdf-cover";
import {
  PaymentPlanId,
  useGetSubscriptionProducts,
} from "../../use-cases/get-subscription-products";
import { useRouter } from "next/router";
import React from "react";

export interface IPaymentPageInteractor {
  selectedPlan: PaymentPlanId;
  onSelectPlan: (plan: PaymentPlanId) => void;
  onContinue: (place?: string) => void;
  onCommentsFlip: () => void;

  imagePDF: Blob | null;
  isImageLoading: boolean;
  fileType: string | null;
  fileLink: string | null;

  isEditorFlow: boolean;
  isSecondEmail: boolean;
  isThirdEmail: boolean;

  isRemoteConfigLoading: boolean;
  fileName: string | null;

  getPlans: (t: (key: string) => string) => Plan[];
  isPlansLoading: boolean;
}

export const usePaymentPageInteractor = (): IPaymentPageInteractor => {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = React.useState<PaymentPlanId>(
    PaymentPlanId.MONTHLY_FULL
  );
  const { products } = useGetSubscriptionProducts();
  const { user } = useUser();

  const [file, setFile] = React.useState<ApiFile>();
  const [imagePDF, setImagePDF] = React.useState<Blob | null>(null);
  const [isImageLoading, setIsImageLoading] = React.useState(false);
  const [fileLink, setFileLink] = React.useState<string | null>(null);

  const { abTests, isRemoteConfigLoading } = useRemoteConfig();

  const isQueryEmail = router.query?.fromEmail === "true";

  const onCommentsFlip = () => {
    console.log("send event analytic0");
  };

  const onSelectPlan = (plan: PaymentPlanId) => {
    if (selectedPlan === plan) {
      onContinue("planTab");
      return;
    }

    setSelectedPlan(plan);

    const product = products?.find((item) => item.name === plan);

    console.log(
      "send event analytic1",
      "productId: ",
      plan,
      "currency: ",
      product?.price?.currency || "USD",
      "value: ",
      (product?.price?.price || 0) / 100
    );
  };

  const onContinue = (place?: string) => {
    console.log(
      "send event analytic2",
      "place: ",
      place ? place : "button",
      "planName: ",
      selectedPlan
    );

    localStorage.setItem("selectedPlan", selectedPlan);

    router.push({ pathname: `${PAGE_LINKS.PAYMENT}`, query: router.query });
  };

  React.useEffect(() => {
    if (user?.subscription !== null) {
      router.push(`${PAGE_LINKS.DASHBOARD}`);
    }

    if (!user?.email) {
      router.back();

      return;
    }

    if (router.query?.token) {
      API.auth.byEmailToken(router.query.token as string);
    }
  }, [user?.subscription, user?.email, router]);

  // @NOTE: analytics on page rendered
  React.useEffect(() => {
    console.log("send event analytic3");
  }, []);

  React.useEffect(() => {
    API.files.getFiles().then((res) => {
      if (router.query?.file) {
        const chosenFile = res.files.find(
          (item) => item.id === router.query.file
        );

        setFile(chosenFile);

        return;
      }
      setFile(res.files.at(-1));
    });
  }, [router.query.file]);

  // @NOTE: setting pre-select plan for users from remarketing emails
  React.useEffect(() => {
    if (isQueryEmail) {
      setSelectedPlan(PaymentPlanId.MONTHLY_FULL_SECOND_EMAIL);
    }
  }, [abTests, isQueryEmail]);

  // @NOTE: generating cover for pdf-documents
  React.useEffect(() => {
    const getFileUrl = async () => {
      if (router.query?.file) {
        return router.query.editedFile === "true"
          ? API.files.editedFile(router.query.file as string).then((r) => r.url)
          : API.files
              .downloadFile(router.query.file as string)
              .then((r) => r.url);
      }

      return API.files.downloadFile(file.id).then((r) => r.url);
    };

    const loadPdfCover = async (): Promise<void> => {
      if (!file || file.internal_type !== InternalFileType.PDF) {
        return;
      }

      setIsImageLoading(true);

      try {
        const fileUrl = await getFileUrl();

        const pdfCover = await generatePDFCover({
          pdfFileUrl: fileUrl,
          width: 640,
        });
        setImagePDF(pdfCover);
      } finally {
        setIsImageLoading(false);
      }
    };

    const loadImageCover = async () => {
      if (
        !file ||
        !imagesFormat.includes(file.internal_type) ||
        !isValidFileExtension(file)
      ) {
        return;
      }

      const fileUrl = await getFileUrl();

      setFileLink(fileUrl);
    };

    loadPdfCover();
    loadImageCover();
  }, [file, router.query]);

  const getPlans = (
    t: (key: string, options?: Record<string, string>) => string
  ): Plan[] => {
    return products.map((product) => getPlan(product, t));
  };

  return {
    selectedPlan,
    onSelectPlan,
    onContinue,
    onCommentsFlip,

    imagePDF: imagePDF ?? null,
    isImageLoading,
    fileName: file?.filename ?? null,
    fileType: file?.internal_type ?? null,
    fileLink,
    isEditorFlow:
      (router.query?.source === "editor" ||
        router.query?.source === "account") &&
      router.query.convertedFrom === undefined,
    isSecondEmail: isQueryEmail,
    isThirdEmail: isQueryEmail,

    isRemoteConfigLoading,

    getPlans,
    isPlansLoading: products.length === 0,
  };
};
