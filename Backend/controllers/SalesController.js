//Adding routes
export function addRoute(router, route, queryFn) {
    router.get(route, async(req, res) => {
    try{
        const data = await queryFn();
        res.json(data);
        console.log(`Route added: GET ${route}`);
    } catch (err){
        console.error(`Failed to get data for ${route}:`, err);
        res.status(500).json({error: `Failed to get data for ${route}`});
    }
});
}
