interface ReturnPoliciesProps {
  content?: string;
}

const ReturnPolicies = ({ content }: ReturnPoliciesProps) => {
  if (!content) {
    return (
      <div className="text-gray-600 text-sm">
        রিটার্ন নীতিমালা সংক্রান্ত তথ্য এখনই উপলব্ধ নয়।
      </div>
    );
  }

  return (
    <div className="prose max-w-none prose-sm sm:prose-base">
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
};

export default ReturnPolicies;
