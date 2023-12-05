type S3UrlData = {
  bucket: string;
  region: string;
  key: string;
};

export const extractDataFromS3URL = (url: string): S3UrlData => {
  const [head, , region] = url.split('.');
  const [, bucket] = head.split('://');
  const [, key] = url.split('.com/');

  return {
    bucket,
    key,
    region,
  };
};
