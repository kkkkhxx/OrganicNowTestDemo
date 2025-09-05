import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        // เพิ่มการตั้งค่า CORS สำหรับทุก endpoint
        registry.addMapping("/**") // ใช้ทุก path ใน Backend
                .allowedOrigins("http://localhost:5173") // กำหนด URL ของ Frontend
                .allowedMethods("GET", "POST", "PUT", "DELETE", "PATCH") // ระบุ methods ที่อนุญาต
                .allowedHeaders("*") // อนุญาตให้ทุก headers
                .allowCredentials(true); // หากต้องการอนุญาต cookies หรือ credentials
    }
}