// …imports unchanged…
function AddNewCoursePage() {
  // …logic unchanged…
  return (
    <div className="w-full p-4">
      <div className="flex justify-between">
        <h1 className="text-3xl font-extrabold mb-5">Create a new course</h1>
        <div>
          {/* buttons unchanged */}
        </div>
      </div>
      <Card className="glass">
        <CardContent>
          <div className="w-full p-4">
            {/* tabs + content unchanged */}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
export default AddNewCoursePage;
