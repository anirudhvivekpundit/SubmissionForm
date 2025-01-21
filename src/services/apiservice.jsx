import axios from "axios";
import { baseUrl, categoryEndpoint, submissionEndpoint } from "./constants"

export const getCategory = async () => {
    const url = baseUrl + categoryEndpoint;
    try {
        const response = await axios.get(url);
        if (response.status === 200) {
            return response.data;
        } else {
            throw new Error(`Failed to fetch categories: ${response.status}`);
        }
    } catch (error) {
        console.error('Error fetching categories:', error);
        throw error;
    }
}

export const postSubmission = async ( FullName , EmailAddress , PhoneNumber , TitleOfSubmission , CategoryOfSubmission , DescriptionOfSubmission,UploadFolder,ConsentAndAgreement,zipFile ) =>
{
    console.log(FullName,EmailAddress,PhoneNumber,TitleOfSubmission,CategoryOfSubmission,DescriptionOfSubmission,zipFile,ConsentAndAgreement);
    const url = baseUrl + submissionEndpoint;
    const formData = new FormData();
    formData.append('FullName', FullName);
    formData.append('EmailAddress', EmailAddress);
    formData.append('PhoneNumber', PhoneNumber);
    formData.append('TitleOfSubmission', TitleOfSubmission);
    formData.append('CategoryOfSubmission', CategoryOfSubmission);
    formData.append('DescriptionOfSubmission', DescriptionOfSubmission);
    formData.append('zipFile', zipFile);
    formData.append('ConsentAndAgreement', ConsentAndAgreement);
    formData.append('UploadFolder',UploadFolder);

    try {
      const response = await axios.post(url, {FullName,EmailAddress,PhoneNumber,TitleOfSubmission,CategoryOfSubmission,DescriptionOfSubmission,UploadFolder,ConsentAndAgreement,zipFile}, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Submission successful:', response.data);
    } catch (error) {
      console.error('Error submitting the form:', error.response || error.message);
    }
}