@RestController
public class TestController {

    @GetMapping("/ping")
    public String ping() {
        return "pong";
    }
}
