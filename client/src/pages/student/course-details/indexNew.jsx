// …imports unchanged…
function StudentViewCourseDetailsPageNew() {
  // (same logic as your current file)
  // only the outer wrappers change to full width
  // paste the whole file if easier, but the key is the top-level containers:

  // inside return:
  return (
    <div className="w-full p-4">
      <div className="glass p-8 rounded-xl">
        <h1 className="text-3xl font-bold mb-4">{studentViewCourseDetails?.title}</h1>
        <p className="text-xl text-muted-foreground mb-4">
          {studentViewCourseDetails?.subtitle}
        </p>
        {/* ...the rest of your header metadata */}
      </div>

      <div className="flex flex-col md:flex-row gap-8 mt-8">
        {/* main + aside unchanged structurally */}
        {/* keep your existing content/components */}
      </div>

      {/* dialog sections unchanged */}
    </div>
  );
}
export default StudentViewCourseDetailsPageNew;
