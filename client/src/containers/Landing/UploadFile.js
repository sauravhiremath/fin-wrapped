import "./Landing.css";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@geist-ui/react";
import { Upload } from "@geist-ui/react-icons";

const UploadFile = ({ handleSubmit }) => {
  const onDrop = useCallback((acceptedFile) => {
    handleSubmit(acceptedFile);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    accept: ".csv",
    maxFiles: 1,
    onDrop,
  });

  return (
    <div className="upload">
      <Card
        hoverable
        shadow
        {...getRootProps({ className: "dropzone" })}
        width="40%"
      >
        <input {...getInputProps()} hidden />
        <Upload size={20} />
        <h4>Drag 'n' drop single file here, or click to select files</h4>
      </Card>
    </div>
  );
};

export default UploadFile;
