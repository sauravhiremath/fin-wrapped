import "./Landing.css";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Card } from "@geist-ui/react";
import { Upload } from "@geist-ui/react-icons";

const UploadFile = ({ handleSubmit }) => {
  const onDrop = useCallback((acceptedFiles) => {
    acceptedFiles.forEach((acceptedFile) => {
      const reader = new FileReader();
      reader.onabort = () => console.log("file reading was aborted");
      reader.onerror = () => console.log("file reading has failed");
      reader.onload = (ev) => {
        ev.preventDefault();

        const formData = new FormData();
        const binaryStr = reader.result;
        formData.append("file", binaryStr);
        fetch("http://34.105.210.187:3001/api/process", {
          method: "POST",
          body: formData,
        });
        console.log(formData);
      };

      reader.readAsBinaryString(acceptedFile);
    });
    handleSubmit(acceptedFiles);
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
