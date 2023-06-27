package gr.aueb.cf.ecommerce.config;

import gr.aueb.cf.ecommerce.entity.*;
import jakarta.persistence.EntityManager;
import jakarta.persistence.metamodel.EntityType;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.rest.core.config.RepositoryRestConfiguration;
import org.springframework.data.rest.webmvc.config.RepositoryRestConfigurer;
import org.springframework.http.HttpMethod;
import org.springframework.web.servlet.config.annotation.CorsRegistry;

import java.util.ArrayList;
import java.util.List;
import java.util.Set;

@Configuration
public class MyDataRestConfig implements RepositoryRestConfigurer {

    private EntityManager entityManager;

    @Autowired
    public MyDataRestConfig(EntityManager theEntityManager) {
        entityManager = theEntityManager;
    }

    @Override
    public void configureRepositoryRestConfiguration(RepositoryRestConfiguration config, CorsRegistry cors) {

        HttpMethod[] notAllowedActions = {HttpMethod.PUT, HttpMethod.POST, HttpMethod.DELETE};

        // disable Http Methods PUT,POST,DELETE for Product and Product Category
        config.getExposureConfiguration()
                .forDomainType(Product.class)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(notAllowedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(notAllowedActions));

        config.getExposureConfiguration()
                .forDomainType(ProductCategory.class)
                .withItemExposure((metdata, httpMethods) -> httpMethods.disable(notAllowedActions))
                .withCollectionExposure((metdata, httpMethods) -> httpMethods.disable(notAllowedActions));

        exposeIds(config);
    }

        private void exposeIds(RepositoryRestConfiguration config) {
            Set<EntityType<?>> entities = entityManager.getMetamodel().getEntities();

            List<Class> entityClasses = new ArrayList<>();

            for (EntityType tempEntityType: entities) {
                entityClasses.add(tempEntityType.getJavaType());
            }

            Class[] domainTypes = entityClasses.toArray(new Class[0]);
            config.exposeIdsFor(domainTypes);
    }
}

