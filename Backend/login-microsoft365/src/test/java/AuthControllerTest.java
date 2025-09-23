
import com.fasterxml.jackson.databind.ObjectMapper;
import com.miapp.LoginMicrosoft365Application;
import com.miapp.model.Usuario;
import com.miapp.repository.UsuarioRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;

import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;


@SpringBootTest(classes = LoginMicrosoft365Application.class)
@AutoConfigureMockMvc
public class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private ObjectMapper objectMapper;

//    @Test
//    public void testRegisterUsuario() throws Exception {
//        Usuario usuario = Usuario.builder()
//                .username("testuser")
//                .password("password")
//                .email("testuser@example.com")
//                .idRol(1L)
//                .idFilial(1L)
//                .idTipoDocumento(1L)
//                .numeroDocumento("123456789")
//                .nombre("Test User")
//                .telefono("123456")
//                .celular("987654321")
//                .direccion("Calle Falsa 123")
//                .build();
//
//        mockMvc.perform(post("/register")
//                        .contentType(MediaType.APPLICATION_JSON)
//                        .content(objectMapper.writeValueAsString(usuario)))
//                .andExpect(status().isOk());
//    }
}

