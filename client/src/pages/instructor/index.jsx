// …imports unchanged…
function InstructorDashboardpage() {
  // …state & effects unchanged…

  return (
    <div className="flex min-h-screen w-full">
      <aside className="w-64 hidden md:block border-r glass">
        <div className="p-4">
          <h2 className="text-2xl font-bold mb-4">Instructor View</h2>
          <nav>
            {menuItems.map((menuItem) => (
              <Button
                className="w-full justify-start mb-2"
                key={menuItem.value}
                variant={activeTab === menuItem.value ? "secondary" : "ghost"}
                onClick={
                  menuItem.value === "logout"
                    ? handleLogout
                    : () => setActiveTab(menuItem.value)
                }
              >
                <menuItem.icon className="mr-2 h-4 w-4" />
                {menuItem.label}
              </Button>
            ))}
          </nav>
        </div>
      </aside>

      <main className="flex-1 p-8 overflow-y-auto">
        <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {menuItems.map((menuItem) => (
            <TabsContent value={menuItem.value} key={menuItem.value}>
              {menuItem.component !== null ? menuItem.component : null}
            </TabsContent>
          ))}
        </Tabs>
      </main>
    </div>
  );
}
export default InstructorDashboardpage;
