import http from "@/lib/axios"
import { PredictAcneSeverityBodyType, PredictAcneSeverityResType } from "@/schemaValidations/predictAcneSeverity.schema";

const predictAcneSeverityApiRequest = {
    fromImagePath: (body: PredictAcneSeverityBodyType) => http.post<PredictAcneSeverityResType>('/ai-predict-acne-severity/from-image-path', body),
};

export default predictAcneSeverityApiRequest