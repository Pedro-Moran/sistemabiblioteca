import com.miapp.LoginMicrosoft365Application;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

//@SpringBootTest(classes = LoginMicrosoft365Application.class)
//@AutoConfigureMockMvc
//class OAuth2AzureTest {
//
//    @Autowired
//    private MockMvc mockMvc;
//
//    @Test
//    void shouldRedirectToAzureLoginPage() throws Exception {
//        mockMvc.perform(get("/oauth2/authorization/azure"))
//                .andExpect(status().is3xxRedirection())
//                .andExpect(header().string("Location", containsString("https://login.microsoftonline.com/")));
//    }
//}
