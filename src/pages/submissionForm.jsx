import { useState, useEffect } from "react";
import { getCategory, postSubmission } from "../services/apiservice";
import axios from "axios";
import { baseUrl, categoryEndpoint } from "../services/constants";

const SubmissionForm = () => {
    const [fullName, setFullName] = useState("");
    const [emailAddress, setEmailAddress] = useState("");
    const [phoneNumber, setPhoneNumber] = useState("");
    const [titleOfSubmission, setTitleOfSubmission] = useState("");
    const [categoryOfSubmission, setCategoryOfSubmission] = useState("");
    const [categoryList, setCategoryList] = useState([]);
    const [descriptionOfSubmission, setDescriptionOfSubmission] = useState("");
    const [uploadFolder, setUploadFolder] = useState(null);
    const [filePreview, setFilePreview] = useState(null);
    const [consentAndAgreement, setConsentAndAgreement] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isError, setIsError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);

    const specialCharacterRegex = /[!@#$%^&*()]/;
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploadFolder(file);
            setFilePreview({
                name: file.name,
                size: formatFileSize(file.size)
            });
        }
    };

    const removeFile = () => {
        setUploadFolder(null);
        setFilePreview(null);
    };

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categories = await axios.get(baseUrl+categoryEndpoint);
                if (categories.status === 200) {
                    setCategoryList(categories.data);
                }
            } catch (error) {
                setIsError(true);
                setErrorMessage("Error fetching categories. Please contact support.");
            }
        };

        fetchCategories();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsError(false);
        setIsLoading(true);

        if (specialCharacterRegex.test(fullName)) {
            setIsLoading(false);
            setIsError(true);
            setErrorMessage("Cannot have special characters in your name");
            return;
        }

        if (!emailRegex.test(emailAddress)) {
            setIsLoading(false);
            setIsError(true);
            setErrorMessage("Please enter a valid email");
            return;
        }

        if (!fullName || !emailAddress || !phoneNumber || !titleOfSubmission ||
            !categoryOfSubmission || !descriptionOfSubmission || !uploadFolder || !consentAndAgreement) {
            setIsLoading(false);
            setIsError(true);
            setErrorMessage("Please fill all required fields and accept the terms");
            return;
        }

        try {
            await postSubmission(
                fullName,
                emailAddress,
                phoneNumber,
                titleOfSubmission,
                categoryOfSubmission,
                descriptionOfSubmission,
                "x",
                consentAndAgreement,
                uploadFolder
            );
            setIsLoading(false);
            setShowSuccess(true);
        } catch (error) {
            setIsLoading(false);
            setIsError(true);
            setErrorMessage("Error submitting form. Please contact support.");
        }
    };
    const handleSuccess = (e) => {
        e.preventDefault();
        setFullName("");
        setEmailAddress("");
        setPhoneNumber("");
        setTitleOfSubmission("");
        setCategoryOfSubmission("") 
        setCategoryList([]);
        setDescriptionOfSubmission("");
        setUploadFolder(null);
        setFilePreview(null);
        setConsentAndAgreement(false);
    }

    return (
        <div className="form-container">
            <div className="form-hero">
                <h1 className="form-title">Submit Your Application</h1>
                <p className="form-subtitle">Share your work with us. We're excited to see what you've created.</p>
            </div>

            <div className="form-group">
                <label>Full Name</label>
                <input className="form-input" type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
            </div>

            <div className="form-group">
                <label>Email Address</label>
                <input className="form-input" type="email" value={emailAddress} onChange={(e) => setEmailAddress(e.target.value)} required />
            </div>

            <div className="form-group">
                <label>Phone Number</label>
                <input className="form-input" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
            </div>

            <div className="form-group">
                <label>Title of Submission</label>
                <input className="form-input" type="text" value={titleOfSubmission} onChange={(e) => setTitleOfSubmission(e.target.value)} required />
            </div>

            <div className="form-group category-group">
                <label>Category</label>
                <select
                    value={categoryOfSubmission}
                    onChange={(e) => setCategoryOfSubmission(e.target.value)}
                    required
                >
                    <option value="" disabled>Select Category</option>
                    {categoryList.map(category => (
                        <option className=" form-group  category-group" key={category.categoryID} value={category.categoryID}>
                            {category.categoryName}
                        </option>
                    ))}
                </select>
            </div>

            <div className="form-group">
                <label>Description of Submission</label>
                <textarea className="form-input"
                    value={descriptionOfSubmission}
                    onChange={(e) => setDescriptionOfSubmission(!consentAndAgreement)}
                    required
                    rows="4"
                />
            </div>

            <div className={`file-upload ${filePreview ? 'has-file' : ''}`}>
                {!filePreview ? (
                    <div className="file-upload-content">
                        <div className="file-upload-icon">📎</div>
                        <p>Drag and drop your file here or click to browse</p>
                    </div>
                ) : (
                    <div className="file-preview">
                        <span className="file-preview-icon">📄</span>
                        <div className="file-preview-info">
                            <div className="file-preview-name">{filePreview.name}</div>
                            <div className="file-preview-size">{filePreview.size}</div>
                        </div>
                        <button className="file-preview-remove" onClick={removeFile}>✕</button>
                    </div>
                )}
                <input type="file" onChange={handleFileChange} />
            </div>

            <div className="checkbox-wrapper">
                <div className="checkbox-input">
                    <input
                        type="checkbox"
                        checked={consentAndAgreement}
                        onChange={(e) => setConsentAndAgreement(e.target.checked)}
                    />
                    <div className="checkbox-control"></div>
                </div>
                <label>I hereby agree and consent to the terms and conditions</label>
            </div>

            <button className="submit-button" onClick={handleSubmit}>
                Submit Application
            </button>

            {isLoading && (
                <div className="loading-overlay">
                    <div className="loading-spinner"></div>
                </div>
            )}

            {isError && (
                <div className="error-message">
                    ⚠️ {errorMessage}
                </div>
            )}

            {showSuccess && (
                <div className="modal-overlay">
                    <div className="success-modal">
                        <div className="success-icon">✓</div>
                        <h2 className="success-title">Submission Successful!</h2>
                        <p className="success-message">
                            Thank you for your submission. We'll review it and get back to you soon.
                        </p>
                        <button
                            className="success-button"
                            onClick={(e) => handleSuccess(e)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SubmissionForm;