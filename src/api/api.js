import { CompreFace } from "@exadel/compreface-js-sdk";

let server = "https://api.utasystem.ml";
let port = 443;
let core = new CompreFace(server, port);
// export const IMAGE_URL =
//   "http://localhost:8000/api/v1/static/b090abee-b925-4055-a2fd-a9d178c5dd61/images/";
  export const IMAGE_URL =
  "https://api.utasystem.ml/api/v1/static/a8470275-6ad9-491e-9e5c-eec625105e9d/images/";
//Face recognition service is used for face identification. This means that you first need to upload known faces to face collection and then recognize unknown faces among them. When you upload an unknown face, the service returns the most similar faces to it.

//Can Upload new Faces
let recognition_key = "a8470275-6ad9-491e-9e5c-eec625105e9d";
let recognition_service = core.initFaceRecognitionService(recognition_key);

// let detection_key = "3530f8c0-3413-4255-8bd5-6b7034601a74";
// let detection_service = core.initFaceDetectionService(detection_key);

// let verification_key = "5e065669-0a72-419f-aea1-3a8d387a9510";
// let verification_service = core.initFaceVerificationService(verification_key);

//TODO gives subject
export const recognizeExample = async (blob) => {
  try {
    const { result } = await recognition_service.recognize(blob, {
      limit: 10,
      face_plugins: "age,gender",
    });
    const subject = result[0].subjects[0];
    console.log(subject);
    return subject;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const addSubjectExample = async (blob, name) => {
  let faceCollection = recognition_service.getFaceCollection();
  try {
    const response = await faceCollection.add(blob, name);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const fetchAllSubjects = async (subject) => {
  let faceCollection = recognition_service.getFaceCollection();

  try {
    const { faces } = await faceCollection.list();

    return faces;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const fetchImagesBySubject = async (subject) => {
  let faceCollection = recognition_service.getFaceCollection();

  const list = [];
  try {
    const { faces } = await faceCollection.list();
    faces.forEach((face, idx) => {
      if (face.subject === subject) {
        list.push({ src: `${IMAGE_URL}${face.image_id}`, id: idx });
      }
    });
    console.log(list);
    return list;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const deleteAllSubjectExamples = async (subject) => {
  let faceCollection = recognition_service.getFaceCollection();
  try {
    const response = await faceCollection.delete_all_subject(subject);

    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const deleteExampleById = async (example_id) => {
  let faceCollection = recognition_service.getFaceCollection();
  try {
    const response = await faceCollection.delete(example_id);

    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const getSubjects = async () => {
  let subjects = recognition_service.getSubjects();
  try {
    const response = await subjects.list();

    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const createSubject = async (subject) => {
  let subjects = recognition_service.getSubjects();
  try {
    const response = await subjects.add(subject);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};
export const deleteSubject = async (subject) => {
  let subjects = recognition_service.getSubjects();
  try {
    const response = await subjects.delete(subject);
    console.log(response);
    return response;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// export const detectImage = async (blob) => {
//   try {
//     const response = await detection_service.detect(blob, {
//       limit: 1,
//       face_plugins: "age,gender",
//     });
//     console.log(response);
//     return response;
//   } catch (error) {
//     console.log(error);
//     return null;
//   }
// };

const fetchUsers = () => {};
